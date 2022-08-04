import {StorageDriver} from "./storageDriver";

const DEFAULT_CONFIG = {
    rpcUrl: "https://ssc-dao.genesysgo.net/",
    commitment: "finalized",
    lockTimeout: 30 * 60 * 60,
    explorer: "solscan",
    language: "en"
  }

export class WalletStorage extends StorageDriver {

  passcode = null;

  constructor() {
    super()
    this.lock()
  }

  isLocked() {
    return this.passcode === null
  }

  lock() {
    this.passcode = null
  }

  unlock(passcode) {
    this.passcode = passcode
  }

  async getWalletAddr() {
    const inp = this.getPrivate("wallet_addr", this.passcode)
  }

  async setWalletAddr(walletAddr) {
    return this.setPrivate("wallet_addr", walletAddr, this.passcode)
  }


  async getPrivateKey() {
    return this.getPrivate("private_key", this.passcode)
  }

  async getConfig() {
    let cfg = await this.getLocal("config").catch(e => {
      //
    })

    if (!cfg)
      cfg = DEFAULT_CONFIG

    return cfg
  }

  async setConfig(cfg = DEFAULT_CONFIG) {
    return this.setLocal("config", cfg)
  }
}
