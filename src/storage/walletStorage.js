import {DEFAULT_NAMESPACE, StorageDriver} from "./storageDriver";

const DEFAULT_CONFIG = {
  rpcUrl: "https://ssc-dao.genesysgo.net/",
  commitment: "finalized",
  lockTimeout: 30 * 60 * 1000,
  explorer: "solscan",
  language: "en"
}

export class WalletStorage extends StorageDriver {

  passcode = null;

  namespace = "_default"

  constructor() {
    super()
    this.lock()
  }

  setNamespace(ns) {
    this.namespace = ns
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


  async setPrivateKey(walletAddr, privateKey) {
    return this.setEncrypted(this.namespace, "private_key", privateKey, this.passcode)
  }


  async getPrivateKey() {
    return this.getEncrypted(this.namespace, "private_key", this.passcode)
  }

  async getConfig() {
    let cfg = await this.getPlain(DEFAULT_NAMESPACE, "config").catch(e => {
      //
    })

    if (!cfg)
      cfg = DEFAULT_CONFIG

    return cfg
  }

  async setConfig(cfg = DEFAULT_CONFIG) {
    return this.setPlain(DEFAULT_NAMESPACE, "config", cfg)
  }
}
