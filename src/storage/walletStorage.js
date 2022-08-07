import {StorageDriver} from "./storageDriver";

export const DEFAULT_NAMESPACE = {key: "_default", name: "Default Wallet"}

export class WalletStorage extends StorageDriver {

  passcode = null;

  namespace = "_default"

  constructor() {
    super()
  }

  async loadNamespaces() {
    const ns = await this._getLocal("namespaces").catch(e => {
      //No exist
    })

    return ns || [DEFAULT_NAMESPACE]
  }

  setNamespace(ns) {
    this.namespace = ns
  }

  getActiveNamespace() {
    return this.namespace
  }

  /**
   * Lock wallet data
   * @returns {boolean}
   */
  lock() {
    this.passcode = null
    return super.lock()
  }

  /**
   * Attempt to unlock the wallet data with provided passcode
   * @param passcode
   * @returns {boolean}
   */
  async unlock(passcode) {
    if (await super.unlock(passcode)) {
      this.passcode = passcode
      return true
    } else
      return false
  }

  async getWalletAddr() {
    return this.getEncrypted(this.namespace, "wallet_addr", this.passcode)
  }

  async setWalletAddr(walletAddr) {
    return this.setEncrypted(this.namespace, "wallet_addr", walletAddr, this.passcode)
  }
}
