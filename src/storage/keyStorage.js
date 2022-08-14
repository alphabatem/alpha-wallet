import {StorageDriver} from "./storageDriver";

/**
 * Responsible for storage of hd wallet
 */
export class KeyStorage extends StorageDriver {
  namespace = "hd_store"
  privateKey = "private_key"

  _mnemonicKey = `mnemonic`
  _keysUsedKey = `keys_used`


  _c = [];
  _start = new Date().getTime()

  /**
   * Lock all storage calls from being used
   */
  lock() {
    console.log("Locking keystore")
    super.lock()
    this._c = []
    return true
  }

  getUnlockTimeLeft() {
    return (this._start + this.getUnlockTimeout()) - new Date().getTime()
  }

  getUnlockTimeout() {
    return (5 * 60 * 1000)
  }

  /**
   * Unlock storage calls
   */
  async unlock(passcode) {
    const ok = await this.testPasscode(passcode)
    if (!ok)
      return false

    console.log("KeyStore unlocked")
    await super.unlock()
    this._start = new Date().getTime()

    setTimeout(() => this.lock(), this.getUnlockTimeout()) //Lock in 60 seconds (timeout)
    return true
  }

  async setPrivateKey(publicKey, privateKey, passcode) {
    return this.setEncrypted(this.namespace, `${publicKey}.${this.privateKey}`, privateKey, passcode)
  }

  async getPrivateKey(publicKey, passcode) {
    return this.getEncrypted(this.namespace, `${publicKey}.${this.privateKey}`, passcode)
  }

  async isMnemonicSet() {
    return this.existsEncrypted(this.namespace, this._mnemonicKey)
  }

  async getMnemonic(passcode) {
    return this.getEncrypted(this.namespace, this._mnemonicKey, passcode)
  }

  async setMnemonic(mnemonic, passcode) {
    return this.setEncrypted(this.namespace, this._mnemonicKey, mnemonic, passcode)
  }

  async incrementKeysUsed() {
    const count = await this.getPlain(this.namespace, this._keysUsedKey).catch(e => {
      return 0;
    })
    await this.setPlain(this.namespace, this._keysUsedKey, (count || 0) + 1)
  }

  async keysInUse() {
    return await this.getPlain(this.namespace, this._keysUsedKey).catch(e => {
      return 0;
    })
  }
}
