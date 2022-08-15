import {StorageDriver} from "./storageDriver";
import {TimelockStorage} from "./timelockStorage";

export class WalletStorage extends StorageDriver {

  namespace = "_default"
  walletAddr = "0xNULL"

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


  /**
   * Store trusted site map to plain storage
   * TODO Move to encrypted?
   *
   * @param trustedSites
   * @returns {Promise<*>}
   */
  async setTrustedSites(trustedSites) {
    console.log("TS", trustedSites)
    return this.setPlain(this.namespace, "trusted_sites", trustedSites)
  }

  /**
   * Get trusted site map from plain storage
   * TODO move to encrypted?
   * @returns {Promise<void>}
   */
  async getTrustedSites() {
    console.log("Getting trusted sites", this.namespace)
    return await this.getPlain(this.namespace, "trusted_sites").catch((e) => {
      console.warn("Unable to get trusted sites", e)
      return {}
    })
  }


  async getLastActiveNamespace() {
    const ns = await this.getPlain("_", "namespace").catch(e => {
      console.log("unable to get namespace",e )
    })
    if (!ns)
      return

    this.namespace = ns
  }

  async setNamespace(ns) {
    await this.setPlain("_", "namespace", ns)
    this.namespace = ns
  }

  getActiveNamespace() {
    return this.namespace
  }

  async getWalletName() {
    return this.getPlain(this.namespace, "wallet_name")
  }

  getWalletAddr() {
    return this.namespace
  }

  async setWalletAddr(walletAddr, passcode) {
    return this.setEncrypted(this.namespace, "wallet_addr", walletAddr, passcode)
  }

  async setWalletName(name) {
    return this.setPlain(this.namespace, "wallet_name", name)
  }
}
