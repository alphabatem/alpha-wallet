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


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return STORAGE_MGR
  }

  getWalletStore() {
    return this._walletStore
  }

  async getKeyStore() {
    if (await this._keyStore.isLocked())
      return null

    return this._keyStore
  }


  async unlockKeyStore(passcode) {
    const ok = await this.getWalletStore().testPasscode(passcode)
    if (!ok)
      return false

    return await this._keyStore.unlock(passcode)
  }

  /**
   * Unlock the storage for a period of time
   *
   * @param passcode
   * @param lockTimeout
   * @returns {Promise<boolean>}
   */
  async unlock(passcode) {
    const ok = await this.getWalletStore().testPasscode(passcode)
    if (!ok)
      return false

    return await this.getWalletStore().unlock(passcode)
  }
}
