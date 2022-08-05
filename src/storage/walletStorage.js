import {StorageDriver} from "./storageDriver";

const DEFAULT_CONFIG = {
  rpcUrl: "https://ssc-dao.genesysgo.net/",
  commitment: "finalized",
  lockTimeout: 30 * 60 * 1000,
  explorer: "solscan",
  language: "en"
}

export class WalletStorage extends StorageDriver {

  passcode = null;

  constructor() {
    super()
    this.lock()
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
    return this.getEncrypted("wallet_addr", this.passcode)
  }

  async setWalletAddr(walletAddr) {
    return this.setEncrypted("wallet_addr", walletAddr, this.passcode)
  }


  async getPrivateKey() {
    return this.getEncrypted("private_key", this.passcode)
  }

  async getConfig() {
    let cfg = await this.getPlain("config").catch(e => {
      //
    })

    if (!cfg)
      cfg = DEFAULT_CONFIG

    return cfg
  }

  async setConfig(cfg = DEFAULT_CONFIG) {
    return this.setPlain("config", cfg)
  }
}
