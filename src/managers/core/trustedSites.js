export class TrustedSites {

}

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
  }

  setAllowedTokenBalances(mintAddrs = []) {
    this._tokenBalances = mintAddrs
  }

  setMaxSpend(maxSpend) {
    this._maxSpend = maxSpend
  }

  setAutoSignMessages(autoSign) {
    this._autoSignMessage = autoSign
  }

  setAutoSignTransactions(autoSign) {
    this._autoSignTxn = autoSign
  }

  canAutoSignMessages() {
    return this._autoSignMessage
  }

  canAutoSignTransactions() {
    return this._autoSignTxn
  }

  setAutoSignLimit(limit) {
    if (limit < 1)
      throw new Error("invalid auto sign limit")

    this._autoSignLimit = limit
  }
}
