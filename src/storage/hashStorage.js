import CryptoJS from "crypto-js";

/**
 * Responsible for storage of hashed information
 */
export class HashStorage {

  _zonePasscode = "passcode"

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
    const payload = {}
    payload[`${this._zonePasscode}:pk`] = sha

    chrome.storage.local.set(payload)
    return true
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
    const pkHash = await this.getPasscodeHash().catch(e => {
    })
    return Boolean(pkHash)
  }

  /**
   * Test if the passcode is valid or not
   *
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async testPasscode(passcode) {
    const pkHash = await this.getPasscodeHash()
    if (!pkHash) {
      console.debug("Passcode not set")
      return true //Not yet set
    }
    const hash = CryptoJS.SHA3(passcode).toString(CryptoJS.enc.Hex)
    return pkHash === hash
  }
}
