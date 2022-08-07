import {AbstractManager} from "../abstractManager";

export const STORAGE_MGR = "storage_mgr"

export class StorageManager extends AbstractManager {
  _walletStore
  _keyStore

  constructor(walletStore, keyStore) {
    super();

    this._walletStore = walletStore
    this._keyStore = keyStore
  }

  id() {
    return STORAGE_MGR
  }

  async getWalletStore() {
    return this._walletStore
  }

  async getKeyStore(passcode) {
    const ok = await this._keyStore.unlock(passcode)
    if (!ok)
      throw new Error("invalid passcode")

    return this._keyStore
  }

}
