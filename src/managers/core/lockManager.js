import {AbstractManager} from "../abstractManager";
import {CFG_MGR} from "./configManager";

export class LockManager extends AbstractManager {

  _locked = true

  _defaultTimeout = 5 * 60 * 1000

  _lockTimeout = null

  id() {
    return LOCK_MGR
  }

  /**
   * Test passcode against store
   * @param p
   * @returns {Promise<*|boolean>}
   */
  async testPasscode(p) {
    return await this.getStore().testPasscode(p)
  }

  /**
   * Check if the wallet is locked
   *
   * @returns {boolean}
   */
  isLocked() {
    return this._locked
  }

  /**
   * Attempt to unlock the wallet
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async unlock(passcode) {
    const ok = await this.getStore().testPasscode(passcode)
    if (!ok) {
      throw new Error("invalid passcode")
    }

    this._locked = false

    const lockTimeout = await this.getTimeout()
    this._lockTimeout = setTimeout(() => this.lock(), lockTimeout)

    return true
  }

  /**
   * Lock the wallet
   */
  lock() {
    this._locked = true

    if (this._lockTimeout)
      clearTimeout(this._lockTimeout)
  }


  async getTimeout() {
    const mgr = this.getManager(CFG_MGR)
    if (!mgr) {
      console.warn("Config manager not enabled")
      return this._defaultTimeout
    }

    const timeout = await mgr.getLockTimeout()
    return timeout || this._defaultTimeout
  }
}

const LOCK_MGR = "lock_mgr"
