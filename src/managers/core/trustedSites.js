import {AbstractManager} from "../abstractManager";

export class TrustedSites extends AbstractManager {

  approvedSites = {} //TODO populate onConfig

  configure(ctx) {
    super.configure(ctx);
    this.approvedSites = this.getStore().getTrustedSites()
  }

  id() {
    return TRUSTED_SITE_MGR
  }

  isTrusted(uri) {
    return this.approvedSites[uri]
  }

  addTrustedSite(uri, cfg) {
    if (this.approvedSites[uri])
      return true //Already approved

    this.approvedSites[uri] = cfg
    this._updateSiteStore()
  }

  updateTrustedSite(uri, cfg) {
    if (!this.approvedSites[uri])
      return

    this.approvedSites[uri] = cfg
    this._updateSiteStore()
  }

  async _updateSiteStore() {
    await this.getStore().setTrustedSites(this.approvedSites)
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
