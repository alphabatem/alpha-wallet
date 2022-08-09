import CryptoJS from "crypto-js";
import {AESJsonFormatter} from "./AESJsonFormatter";
import {HashStorage} from "./hashStorage";

//Driver extended off hash storage to provide access to storage calls from
// client
export class StorageDriver extends HashStorage {

  _locked = false

  _zonePrivate = "private" //Encrypted
  _zonePlain = "plain" //Unencrypted

  async isLocked() {
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
  async unlock() {
    this._locked = false
    return true
  }

  /**
   * Get temporary session data
   * @param key
   * @returns {Promise<unknown>}
   */
  async _getSession(key) {
    if (await this.isLocked()) return null

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
  async _setSession(key, value) {
    if (await this.isLocked()) return null

    const payload = {}
    payload[key] = value

    return new Promise((resolve, reject) => {
      chrome.storage.session.set(payload).then(() => {
        resolve(value);
      }).catch(e => {
        // console.error("_setLocal err", e)
      });
    });
  };

  /**
   * Get user local data
   * @param key
   * @returns {Promise<unknown>}
   */
  async _getLocal(key, skipLockCheck = false) {
    if (!skipLockCheck && await this.isLocked()) return null

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
    if (await this.isLocked()) return null

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
   * Returns if a key exists in plain store
   *
   * @param namespace
   * @param key
   * @returns {Promise<boolean>}
   */
  async existsPlain(namespace, key) {
    const inp = await this._getLocal(`${namespace}.${this._zonePlain}.${key}`, true).catch(e => {
    })
    return Boolean(inp)
  }


  /**
   * Returns if a key exists in encrypted store
   *
   * @param namespace
   * @param key
   * @returns {Promise<boolean>}
   */
  async existsEncrypted(namespace, key) {
    const inp = await this._getLocal(`${namespace}.${this._zonePrivate}.${key}`).catch(e => {
    })
    return Boolean(inp)
  }

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

    const inp = await this._getLocal(`${namespace}.${this._zonePrivate}.${key}`)
    return this.decryptValue(inp, passcode)
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

    const out = this.encryptValue(value, passcode)
    return this._setLocal(`${namespace}.${this._zonePrivate}.${key}`, out)
  }


  /**
   * Get an encrypted value
   *
   * @param namespace
   * @param key
   * @param passcode
   * @returns {Promise<null|*>}
   */
  async getSessionEncrypted(namespace, key, passcode = null) {
    if (!passcode)
      throw new Error("password not provided")

    const inp = await this._getLocal(`${namespace}.${this._zonePrivate}.${key}`)
    return this.decryptValue(inp, passcode)
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
  async setSessionEncrypted(namespace, key, value, passcode = null) {
    if (!passcode)
      throw new Error("password not provided")

    const out = this.encryptValue(value, passcode)
    return this._setLocal(`${namespace}.${this._zonePrivate}.${key}`, out)
  }

  async clearSessionEncrypted(namespace, key) {
    return chrome.storage.local.remove(`${namespace}.${this._zonePrivate}.${key}`)
  }

  async existsSessionEncrypted(namespace, key) {
    const inp = await this._getLocal(`${namespace}.${this._zonePrivate}.${key}`).catch(e => {
    })
    return Boolean(inp)
  }

  /**
   * Get unencrypted user data
   *
   * @param namespace
   * @param key
   * @returns {Promise<*>}
   */
  async getPlain(namespace, key) {
    return this._getLocal(`${namespace}.${this._zonePlain}.${key}`)
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
    return this._setLocal(`${namespace}.${this._zonePlain}.${key}`, value)
  }


  async clearPlain(namespace, key) {
    return chrome.storage.local.remove(`${namespace}.${this._zonePlain}.${key}`)
  }


  async clearEncrypted(key, passcode) {
    const ok = await this.testPasscode(passcode)
    if (!ok)
      throw new Error("invalid passcode")

    return chrome.storage.local.remove(`${this._zonePrivate}.${key}`)
  }

  /**
   * Decrypt a given value with provided passcode
   *
   * @param value
   * @param passcode
   * @returns {*}
   */
  decryptValue(value, passcode) {
    if (!passcode) return
    return CryptoJS.AES.decrypt(value, passcode, {format: new AESJsonFormatter()}).toString(CryptoJS.enc.Utf8)
  }

  /**
   * Encrypt a value with given passcode
   *
   * @param value
   * @param passcode
   * @returns {*}
   */
  encryptValue(value, passcode) {
    if (!passcode) return
    const encrypted = CryptoJS.AES.encrypt(value, passcode, {format: new AESJsonFormatter()})
    return encrypted.toString()
  }
}
