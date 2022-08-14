import {AbstractManager} from "../abstractManager";
import {EVENT_MGR, EVENTS} from "./eventManager";
import {NS_MANAGER} from "./namespaceManager";

const DEFAULT_CONFIG = {
  rpcUrl: "https://ssc-dao.genesysgo.net/",
  commitment: "finalized",
  explorer: "solscan",
  lockTimeout: 30 * 60 * 1000,
  language: "en"
}

export class ConfigManager extends AbstractManager {

  config = DEFAULT_CONFIG

  //Allowed keys
  allowedKeys = {
    rpcUrl: true,
    commitment: true,
    explorer: true,
  }

  id() {
    return CFG_MGR
  }

  configure(ctx) {
    super.configure(ctx)

    this.getManager(EVENT_MGR).subscribe(EVENTS.onWalletSelect, (ns) => this.onNamespaceSelect(ns))
  }

  onNamespaceSelect(ns) {
    this.getConfig().then((r) => {
      this.config = r
    })
  }

  async getLockTimeout() {
    const cfg = await this.getConfig()
    return cfg.lockTimeout
  }

  async getConfig() {
    const ns = await this.getManager(NS_MANAGER).getActiveNamespace()
    let cfg = await this.getStore().getPlain(ns.key, "config").catch(e => {
      //
    })

    if (!cfg)
      cfg = DEFAULT_CONFIG

    this.notify(cfg)
    return cfg
  }

  getConfigValue(key) {
    return this.config[key]
  }

  async setConfigValue(key, value) {
    console.log("setConfigValue", key, value, this.config)
    if (!this.allowedKeys[key])
      return

    this.config[key] = value

    return await this.setConfig(this.config)
  }

  async setConfig(cfg = DEFAULT_CONFIG) {
    const ns = await this.getManager(NS_MANAGER).getActiveNamespace()

    console.log("Updating config", ns, cfg)
    await this.getStore().setPlain(ns.key, "config", cfg)
    this.notify(cfg)
  }

  notify(data = {}) {
    const mgr = this.getManager(EVENT_MGR)
    if (!mgr) return

    mgr.onEvent(EVENTS.onConfig, data)
  }


  getRPCUrl() {
    return this.config.rpcUrl
  }

  /**
   * Returns the explorer url to use based on user preference
   * @returns {string}
   */
  getExplorerUrl() {
    switch (this.config.explorer) {
      case "solana_fm":
        return "https://solana.fm"
      case "solana_explorer":
        return "https://explorer.solana.com"
      case "solscan":
        return "https://solscan.io"
      case "solanabeach":
        return "https://solanabeach.io"
    }
    return "https://solana.fm"
  }

}

export const CFG_MGR = "config_manager"
