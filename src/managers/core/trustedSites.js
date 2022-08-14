import {AbstractManager} from "../abstractManager";
import {EVENT_MGR, EVENTS} from "./eventManager";

export class TrustedSites extends AbstractManager {

  approvedSites = {} //TODO populate onConfig

  configure(ctx) {
    super.configure(ctx);
    this.getManager(EVENT_MGR).subscribe(EVENTS.onConfig, (c) => this.onConfig(c))
  }

  id() {
    return TRUSTED_SITE_MGR
  }

  async onConfig() {
    console.log("TrustedSite Manager", "onConfig")
    await this.getTrustedSites()
  }

  async isTrusted(uri) {
    await this.getTrustedSites()
    return this.approvedSites[uri]
  }

  async getTrustedSites() {
    this.approvedSites = await this.getStore().getTrustedSites()
    return this.approvedSites
  }

  async addTrustedSite(uri, cfg) {
    if (!uri)
      throw new Error("invalid site uri")

    if (this.approvedSites[uri])
      return true //Already approved

    console.log("Adding trusted site", uri, cfg)
    this.approvedSites[uri] = cfg
    return await this._updateSiteStore()
  }

  async updateTrustedSite(uri, cfg) {
    if (!this.approvedSites[uri])
      return

    this.approvedSites[uri] = cfg
    return await this._updateSiteStore()
  }

  async _updateSiteStore() {
    await this.getStore().setTrustedSites(this.approvedSites)
  }

  async setTrustedSiteRequest(uri) {
    return await this.getStore().setPlain("_requests", "trusted_site", uri)
  }

  async getTrustedSiteRequest() {
    return await this.getStore().getPlain("_requests", "trusted_site")
  }

  _toTrustedSite(uri, cfg) {
    const ts = new TrustedSite(uri)
      .setMaxSpend(cfg.maxSpend)
      .setAllowedTokenBalances(cfg.tokenBalances)
      .setAutoSignLimit(cfg.autoSignLimit)
      .setAutoSignTransactions(cfg.autoSignTxn)
      .setAutoSignMessages(cfg.autoSignMsg)

    return ts
  }
}

export const TRUSTED_SITE_MGR = "trusted_site_mgr"

export class TrustedSite {

  uri

  logoUri //TODO fill from meta (should be on load, not stored)
  name //TODO fill from meta (should be on load, not stored)

  _maxSpend = 1000000000 //1 SOL

  _tokenBalances = ["*"]

  _autoSignMessage = false

  _autoSignTxn = false

  _autoSignLimit = 3 //Amount of times we auto sign before re-requesting

  constructor(uri) {
  }

  setAllowAllTokenBalances() {
    this._tokenBalances = ["*"]
    return this
  }

  setAllowedTokenBalances(mintAddrs = []) {
    this._tokenBalances = mintAddrs
    return this
  }

  setMaxSpend(maxSpend) {
    this._maxSpend = maxSpend
    return this
  }

  setAutoSignMessages(autoSign) {
    this._autoSignMessage = autoSign
    return this
  }

  setAutoSignTransactions(autoSign) {
    this._autoSignTxn = autoSign
    return this
  }

  setAutoSignLimit(limit) {
    if (limit < 1)
      throw new Error("invalid auto sign limit")

    this._autoSignLimit = limit
    return this
  }

  canAutoSignMessages() {
    return this._autoSignMessage
  }

  canAutoSignTransactions() {
    return this._autoSignTxn
  }
}
