import {AbstractManager} from "../abstractManager";
import {CFG_MGR} from "./configManager";

export class LockManager extends AbstractManager {

  _locked = true

  _defaultTimeout = 5 * 60 * 1000

  _lockTimeout = null

  statusIndicatorDom

  id() {
    return LOCK_MGR
  }

  configure(ctx) {
    super.configure(ctx);

    this.statusIndicatorDom = document.getElementById("connection_status")
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
    const lockTimeout = await this.getTimeout()

    //Store for the duration of our usage in encrypted session
    const ok = await this.getStorageManager().unlock(passcode, lockTimeout)
    if (!ok)
      throw new Error("invalid passcode")

    this._locked = false
    this._lockTimeout = setTimeout(() => this.lock(), lockTimeout)

    this.statusIndicatorDom.innerText = "Unlocked"
    return true
  }

  /**
   * Lock the wallet
   */
  lock() {
    this._locked = true
    if (this._lockTimeout)
      clearTimeout(this._lockTimeout)

    this.statusIndicatorDom.innerText = "Locked"
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
