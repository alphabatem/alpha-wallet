import {StorageDriver} from "./storageDriver";

/**
 * Responsible for storage of hd wallet
 */
export class KeyStorage extends StorageDriver {
  namespace = "hd_store"

  async addPrivateKey(walletAddr, privateKey, passcode) {
    return this.setEncrypted(this.namespace, "private_key", privateKey, passcode)
  }

  async getPrivateKey(passcode) {
    return this.getEncrypted(this.namespace, "private_key", passcode)
  }
}
