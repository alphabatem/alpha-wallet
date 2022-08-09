import {AbstractManager} from "../abstractManager";
import CryptoJS from "crypto-js";

export class PinManager extends AbstractManager {

  _namespace = "pin"

  _codeKey = "code"
  _hashKey = "hash"
  _saltKey = "salt"

  id() {
    return PIN_MGR
  }

  configure(ctx) {
    super.configure(ctx);

    this.isPinCodeSet().then(ok => {
      if (ok) {
        console.log("Cached pinCode present, unlocking")
        this.getStore().unlock()
      }
    })
  }

  /**
   * Store encrypted passcode with given pin
   * Pin value is salted to increase entropy on hash
   *
   * @param pin - Min length: 6
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async cachePasscodeWithPin(pin, passcode) {
    if (!pin || !passcode || pin.length < 5)
      return false

    const salt = crypto.randomUUID()
    await this.newPinHash(pin, salt)

    await this.getStore().setSessionEncrypted(this._namespace, this._codeKey, passcode, this.getSaltedValue(pin, salt))

    return true
  }

  async newPinHash(pin, salt) {
    const p = this._getHash(pin, salt)
    await this._setPinHash(p)
    await this._setSalt(salt)
    return p
  }

  async _setSalt(salt) {
    return await this.getStore().setPlain(this._namespace, this._saltKey, salt)
  }

  async getSalt() {
    return await this.getStore().getPlain(this._namespace, this._saltKey)
  }

  async _getPinHash() {
    return await this.getStore().getPlain(this._namespace, this._hashKey)
  }

  /**
   * Store our salted SHA3 hash Pin for evaluation
   *
   * @param pinHash
   * @returns {Promise<*>}
   * @private
   */
  async _setPinHash(pinHash) {
    return await this.getStore().setPlain(this._namespace, this._hashKey, pinHash)
  }

  /**
   * Get passcode from pin
   *
   * @param pin
   * @returns {Promise<*|null>}
   */
  async getPasscode(pin) {
    if (!this.testPin(pin))
      throw new Error("invalid pincode")

    const salt = await this.getSalt()
    const enc = await this.getStore().getSessionEncrypted(this._namespace, this._codeKey, this.getSaltedValue(pin, salt))

    return enc
  }

  /**
   * Clear cache & regenerate salt
   *
   * @returns {Promise<void>}
   */
  async clearCache() {
    console.log("Clearing pin cache")
    await this.getStore().clearSessionEncrypted(this._namespace, this._codeKey).catch(e => console.error("clearCache err", e))
    await this.getStore().clearPlain(this._namespace, this._hashKey).catch(e => console.error("clearCache err", e))
    await this.getStore().clearPlain(this._namespace, this._saltKey).catch(e => console.error("clearCache err", e))
  }

  /**
   * Test if pin is valid against our hash
   *
   * @param pin
   * @returns {boolean}
   */
  async testPin(pin) {
    return this._getHash(pin, await this.getSalt()) === await this._getPinHash()
  }

  /**
   * Return a salted value of our pin
   *
   * @param pin
   * @param salt
   * @returns {string}
   */
  getSaltedValue(pin, salt) {
    return `${pin}:${salt}`
  }

  /**
   * Get the hash of a given pin + salt
   *
   * @param pin
   * @param salt
   * @returns {*}
   */
  _getHash(pin, salt) {
    return CryptoJS.SHA3(this.getSaltedValue(pin, salt)).toString(CryptoJS.enc.Hex)
  }

  async isPinCodeSet() {
    const pkHash = await this.getStore().existsSessionEncrypted(this._namespace, this._codeKey).catch(e => {
      return false
    })

    if (!pkHash)
      return false

    return true
  }
}


export const PIN_MGR = "pin_manager"
