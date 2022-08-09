/**
 * Responsible for holding timelocked storage items in an encrypted form
 * Values are stored in AES256
 */

export class TimelockStorage {

  namespace = "timelock_store"

  //Additional layer of abstraction
  _tsPasscode

  // og_key -> {time: unix, key: abc}
  storedAt = {}

  driver

  constructor(storageDriver) {
    this.driver = storageDriver
    this._tsPasscode = crypto.randomUUID()
    setInterval(() => this.clearOutdated(), 60 * 1000) //Check storage every
    // minute
  }

  /**
   * @param key
   * @param value
   * @param expiresIn
   * @returns {Promise<*>}
   */
  async set(key, value, expiresIn) {
    if (!expiresIn)
      throw new Error("missing expiry")

    this.storedAt[key] = {
      key: crypto.randomUUID(),
      time: new Date().getTime() + expiresIn
    }
    return this.driver.setSessionEncrypted(this.namespace, this.storedAt[key].key, value, this._tsPasscode)
  }

  /**
   * Returns the given value if it exists
   * @param key
   * @returns {null|Promise<*|null>}
   */
  async get(key) {
    if (!this.storedAt[key])
      return null

    if (new Date().getTime() > this.storedAt[key].time)
      return null

    return this.driver.getSessionEncrypted(this.namespace, this.storedAt[key].key, this._tsPasscode)
  }


  async clear(key) {
    return this.driver.clearSessionEncrypted(key)
  }

  /**
   * Clears outdated keys
   */
  clearOutdated() {
    const si = Object.keys(this.storedAt)
    const sk = Object.values(this.storedAt)
    for (let i = 0; i < sk.length; i++) {
      if (new Date().getTime() > sk[i].time) {
        delete this.storedAt[si[i]]
        this.clear(sk[i].key)
      }
    }
  }

}
