import {StorageDriver} from "./storageDriver";
import {TimelockStorage} from "./timelockStorage";

export class WalletStorage extends StorageDriver {

  namespace = "_default"

  timelock

  constructor() {
    super()
    this.timelock = new TimelockStorage(this)
  }

  async loadNamespaces() {
    const ns = await this.getPlain("_", "namespaces").catch(e => {
      //No exist
    })

    return ns || []
  }

  async storeNamespaces(ns = []) {
    return this.setPlain("_", "namespaces", ns)
  }

  setNamespace(ns) {
    console.log("Namespace set", ns)
    this.namespace = ns
  }

  getActiveNamespace() {
    return this.namespace
  }

  async getWalletName() {
    return this.getPlain(this.namespace, "wallet_name")
  }

  async getWalletAddr() {
    console.log("getting wallet addr for ns: ", this.namespace)
    return await this.getEncrypted(this.namespace, "wallet_addr", await this.getCachedPasscode()).catch(e => {
    })
  }

  async setWalletAddr(walletAddr) {
    return this.setEncrypted(this.namespace, "wallet_addr", walletAddr, await this.getCachedPasscode())
  }

  async setWalletName(name) {
    return this.setPlain(this.namespace, "wallet_name", name)
  }

  /**
   * Unlock & cache passcode for period of time
   * @param passcode
   * @param lockedIn
   * @returns {Promise<boolean>}
   */
  async unlock(passcode, lockedIn) {
    if (!await super.unlock(passcode))
      return false

    await this.cachePasscode(passcode, lockedIn)
    return true
  }


  /**
   * Cache passcode in encrypted timestore for x milliseconds
   * @param passcode
   * @param clearIn
   * @returns {Promise<*>}
   */
  async cachePasscode(passcode, clearIn) {
    return this.timelock.set("passcode", passcode, clearIn)
  }

  /**
   * Get cached passcode from encrypted timestore
   * @returns {Promise<*>}
   */
  async getCachedPasscode() {
    return this.timelock.get("passcode")
  }
}
