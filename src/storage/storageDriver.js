import CryptoJS from "crypto-js";
import {AESJsonFormatter} from "./AESJsonFormatter";
import {HashStorage} from "./hashStorage";

//Driver extended off hash storage to provide access to storage calls from
// client
export class StorageDriver extends HashStorage {

  _locked = false

  _zonePrivate = "private" //Encrypted
  _zonePlain = "plain" //Unencrypted

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
   * Get an encrypted value
   *
   * @param namespace
   * @param key
   * @param passcode
   * @returns {Promise<null|*>}
   */
  async getEncrypted(namespace, key, passcode = null) {
    const ok = await this.testPasscode(passcode)
    if (!ok)
      throw new Error("invalid passcode")

    const inp = await this._getLocal(`${this._zonePrivate}.${key}`)
    return CryptoJS.AES.decrypt(inp, passcode, {format: new AESJsonFormatter()}).toString(CryptoJS.enc.Utf8)
  }

  /**
   * Set an encrypted value
   *
   * @param namespace
   * @param key
   * @param value
   * @param passcode
   * @returns {Promise<unknown>}
   */
  async setEncrypted(namespace, key, value, passcode = null) {
    const ok = await this.testPasscode(passcode)
    if (!ok)
      throw new Error("invalid passcode")

    const out = CryptoJS.AES.encrypt(value, passcode, {format: new AESJsonFormatter()});
    return this._setLocal(`${this._zonePrivate}.${key}`, out)
  }

  /**
   * Get unencrypted user data
   *
   * @param namespace
   * @param key
   * @returns {Promise<*>}
   */
  async getPlain(namespace, key) {
    return this._getLocal(`${this._zonePlain}.${key}`)
  }

  /**
   * Set unencrypted user data
   *
   * @param namespace
   * @param key
   * @param value
   * @returns {Promise<unknown>}
   */
  async setPlain(namespace, key, value) {
    return this._setLocal(`${this._zonePlain}.${key}`, value)
  }
}
