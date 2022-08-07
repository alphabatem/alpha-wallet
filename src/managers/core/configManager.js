import {AbstractManager} from "../abstractManager";
import {DEFAULT_NAMESPACE} from "../../storage/walletStorage";
import {EVENT_MGR, EVENTS} from "./eventManager";

const DEFAULT_CONFIG = {
  rpcUrl: "https://ssc-dao.genesysgo.net/",
  commitment: "finalized",
  lockTimeout: 30 * 60 * 1000,
  explorer: "solscan",
  language: "en"
}

export class ConfigManager extends AbstractManager {

  config = DEFAULT_CONFIG

  id() {
    return CFG_MGR
  }

  configure(ctx) {
    super.configure(ctx)
    this.getConfig().then((r) => {
      this.config = r
    })
  }

  async getLockTimeout() {
    const cfg = await this.getConfig()
    return cfg.lockTimeout
  }

  async getConfig() {
    let cfg = await this.getStore().getPlain(DEFAULT_NAMESPACE, "config").catch(e => {
      //
    })

    if (!cfg)
      cfg = DEFAULT_CONFIG

    this.notify()
    return cfg
  }

  async setConfig(cfg = DEFAULT_CONFIG) {
    return this.getStore().setPlain(DEFAULT_NAMESPACE, "config", cfg)
  }

  notify(data = {}) {
    const mgr = this.getManager(EVENT_MGR)
    if (!mgr) return

    mgr.onEvent(EVENTS.onConfig, data)
  }

}

export const CFG_MGR = "config_manager"
