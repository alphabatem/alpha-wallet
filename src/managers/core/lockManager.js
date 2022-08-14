import {AbstractManager} from "../abstractManager";
import {PIN_MGR} from "./pinManager";
import {EVENT_MGR, EVENTS} from "./eventManager";
import {STORAGE_MGR} from "../storage/storageManager";

export class LockManager extends AbstractManager {

  _locked = true

  _defaultTimeout = 60 * 1000

  _lockTimeout = null

  statusIndicatorDom


  /**
   * Context ID
   *
   * @returns {string}
   */
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
      return this._unlockPincode(pincode)
    }

    return this._unlockPasscode(passcode)
  }

  /**
   * Attempt to unlock the wallet
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async _unlockPasscode(passcode) {
    //Store for the duration of our usage in encrypted session
    const ok = await this.getStorageManager().unlock(passcode)
    if (!ok)
      throw new Error("invalid passcode")

    this._locked = false

    //Unlock key store for period of time
    await this.getManager(STORAGE_MGR).unlockKeyStore(passcode)

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
  async _unlockPincode(pincode) {
    const pinMgr = this.getManager(PIN_MGR)
    if (!pinMgr)
      return null

    const pk = await pinMgr.getPasscode(pincode).catch(e => {
      throw new Error("invalid pin")
    })

    if (!pk)
      throw new Error("invalid pin")

    return this._unlockPasscode(pk)
  }

  /**
   * Lock the wallet
   */
  lock() {
    console.log("LockManager::lock - Locking wallet", new Date())
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
    this._defaultTimeout = cfg.lockTimeout || this._defaultTimeout

    console.log("Locking wallet in", this._defaultTimeout)
    // this._lockTimeout = setTimeout(() => this.lock(), this._defaultTimeout)
    this._lockTimer()
  }

  _lockTimer() {
    chrome.alarms.onAlarm.addListener((a) => {
      if (a.name === "lock")
        this.lock()
    })

    const minutes = this._defaultTimeout / 60 /  1000
    console.log(`Alarm set for ${minutes} minutes`)
    chrome.alarms.create("lock", {delayInMinutes: minutes})
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
