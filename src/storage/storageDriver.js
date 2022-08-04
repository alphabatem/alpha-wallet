import CryptoJS from "crypto-js";
import {AESJsonFormatter} from "./AESJsonFormatter";

export class StorageDriver {

  _locked = false

  _zonePrivate = "private" //Encrypted
  _zonePlain = "plain" //Unencrypted
  _zonePasscode = "passcode" //Hash


  isLocked() {
    return this._locked
  }

  /**
   * Lock all storage calls from being used
   */
  lock() {
    this._locked = true
    return true
  }

  /**
   * Unlock storage calls
   */
  async unlock(passcode) {
    if (!await this.testPasscode(passcode))
      return false

    this._locked = false
    return true
  }

  /**
   * Get temporary session data
   * @param key
   * @returns {Promise<unknown>}
   */
  async getSession(key) {
    if (this.isLocked()) return null

    return new Promise((resolve, reject) => {
      chrome.storage.session.get([key], function (result) {
        if (result[key] === undefined) {
          reject(new Error(`key not found ${key}`));
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  /**
   * Set temporary session data
   * @param key
   * @param value
   * @returns {Promise<unknown>}
   */
  async setSession(key, value) {
    if (this.isLocked()) return null

    return new Promise((resolve, reject) => {
      chrome.storage.session.set({key: value}, function (result) {
        if (result[key] === undefined) {
          reject(new Error(`key not found ${key}`));
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  /**
   * Get user local data
   * @param key
   * @returns {Promise<unknown>}
   */
  async _getLocal(key) {
    if (this.isLocked()) return null

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        if (!result[key]) {
          reject(new Error(`key not found ${key}`));
        } else {
          resolve(result[key]);
        }
      });
    });
  };

  /**
   * Set user local data
   * @param key
   * @param value
   * @returns {Promise<unknown>}
   * @private
   */
  async _setLocal(key, value) {
    if (this.isLocked()) return null

    const payload = {}
    payload[key] = value

    return new Promise((resolve, reject) => {
      chrome.storage.local.set(payload).then(() => {
        resolve(value);
      }).catch(e => {
        // console.error("_setLocal err", e)
      });
    });

  };


  /**
   * Attempt to update the passcode of the wallet
   *
   * @param currentPasscode
   * @param passcode
   * @returns {Promise<*>}
   */
  async setPasscode(currentPasscode, passcode) {
    if (await this.isPasscodeSet() && !await this.testPasscode(currentPasscode)) {
      return false
    }

    const sha = CryptoJS.SHA3(passcode).toString(CryptoJS.enc.Hex)
    return this._setLocal(`${this._zonePasscode}:pk`, sha)
  }

  /**
   * Return the passcode hash
   * @returns {Promise<*>}
   */
  async getPasscodeHash() {
    const key = `${this._zonePasscode}:pk`
    const res = await chrome.storage.local.get(key)
    return res[key]
  }

  async isPasscodeSet() {
    const pkHash = await this.getPasscodeHash().catch(e => {})
    return Boolean(pkHash)
  }

  /**
   * Test if the passcode is valid or not
   *
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async testPasscode(passcode) {
    const hash = CryptoJS.SHA3(passcode).toString(CryptoJS.enc.Hex)
    const pkHash = await this.getPasscodeHash()

    if (pkHash === null) {
      console.warn("Passcode not set")
      return true //Not yet set
    }

    return pkHash === hash
  }


  /**
   * Get an encrypted value
   *
   * @param key
   * @param passcode
   * @returns {Promise<null|*>}
   */
  async getEncrypted(key, passcode = null) {
    if (!passcode)
      return null

    const inp = await this._getLocal(`${this._zonePrivate}.${key}`)
    return CryptoJS.AES.decrypt(inp, passcode, {format: new AESJsonFormatter()}).toString(CryptoJS.enc.Utf8)
  }

  /**
   * Set an encrypted value
   *
   * @param key
   * @param value
   * @param passcode
   * @returns {Promise<unknown>}
   */
  async setEncrypted(key, value, passcode = null) {
    if (!passcode)
      return null

    const out = CryptoJS.AES.encrypt(value, passcode, {format: new AESJsonFormatter()});
    return this._setLocal(`${this._zonePrivate}.${key}`, out)
  }

  /**
   * Get unencrypted user data
   *
   * @param key
   * @returns {Promise<*>}
   */
  async getPlain(key) {
    return this._getLocal(`${this._zonePlain}.${key}`)
  }

  /**
   * Set unencrypted user data
   *
   * @param key
   * @param value
   * @returns {Promise<unknown>}
   */
  async setPlain(key, value) {
    return this._setLocal(`${this._zonePlain}.${key}`, value)
  }
}
