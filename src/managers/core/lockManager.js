import {AbstractManager} from "../abstractManager";
import {PIN_MGR} from "./pinManager";
import {EVENT_MGR, EVENTS} from "./eventManager";

export class LockManager extends AbstractManager {

  _locked = true

  _defaultTimeout = 60 * 1000

  _lockTimeout = null

  statusIndicatorDom

  id() {
    return LOCK_MGR
  }

  configure(ctx) {
    super.configure(ctx);
    this.getManager(EVENT_MGR).subscribe(EVENTS.onConfig, (c) => this.onConfig(c))
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

  async unlock(passcode, pincode = null) {
    if (!passcode && pincode) {
      passcode = await this.unlockPincode(pincode)
      if (!passcode)
        throw new Error("invalid pin")

      return this.unlockPasscode(passcode)
    }

    return this.unlockPasscode(passcode)
  }

  /**
   * Attempt to unlock the wallet
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async unlockPasscode(passcode) {
    const lockTimeout = await this.getTimeout()

    //Store for the duration of our usage in encrypted session
    const ok = await this.getStorageManager().unlock(passcode, lockTimeout)
    if (!ok)
      throw new Error("invalid passcode")

    this._locked = false
    this._lockTimeout = setTimeout(() => this.lock(), lockTimeout)

    if (this.statusIndicatorDom)
      this.statusIndicatorDom.innerText = "Unlocked"

    this.notify(EVENTS.onUnlock)
    return true
  }

  /**
   * Attempts to unlock the wallet via pincode
   * @param pincode
   * @returns {Promise<null|*|null>}
   */
  async unlockPincode(pincode) {
    const pinMgr = this.getManager(PIN_MGR)
    if (!pinMgr)
      return null

    return pinMgr.getPasscode(pincode).catch(e => {
      return null
    })
  }

  /**
   * Lock the wallet
   */
  lock() {
    this._locked = true
    if (this._lockTimeout)
      clearTimeout(this._lockTimeout)

    this.notify(EVENTS.onLock)

    //Clear pin allocation
    const pinMgr = this.getManager(PIN_MGR)
    if (pinMgr) {
      pinMgr.clearCache()
    }

    if (this.statusIndicatorDom)
      this.statusIndicatorDom.innerText = "Locked"
  }


  async getTimeout() {
    return this._defaultTimeout
  }


  onConfig(cfg) {
    this._defaultTimeout = cfg.lockTimeout
  }

  /**
   * Notify event bus of lock/unlock events
   *
   * @param event
   */
  notify(event) {
    const mgr = this.getManager(EVENT_MGR)
    if (!mgr) return

    mgr.onEvent(event)
  }

}

const LOCK_MGR = "lock_mgr"
