import {StorageDriver} from "./storageDriver";

/**
 * Responsible for storage of hd wallet
 */
export class KeyStorage extends StorageDriver {
  namespace = "hd_store"
  privateKey = "private_key"
  pinKey = "pincode"

  async setPrivateKey(publicKey, privateKey, passcode) {
    return this.setEncrypted(this.namespace, `${publicKey}.${this.privateKey}`, privateKey, passcode)
  }

  async getPrivateKey(publicKey, passcode) {
    return this.getEncrypted(this.namespace, `${publicKey}.${this.privateKey}`, passcode)
  }

  async incrementKeysUsed(publicKey) {
    const count = await this.getPlain(this.namespace, `${publicKey}.keys_used`).catch(e => {
    })
    await this.setPlain(this.namespace, `${publicKey}.keys_used`, (count || 0) + 1)
  }

  async keysInUse(publicKey) {
    return await this.getPlain(this.namespace, `${publicKey}.keys_used`).catch(e => {
    })
  }
}
