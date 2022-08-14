class AlphaConnector {
  isConnected = false

  isMetaMask = false
  isAlphaWallet = true

  publicKey //TODO solana public key of account

  constructor() {
    //TODO Listen for connect, disconnect & swapWallet
  }

  isConnected() {
    return this.isConnected
  }

  sendMessage(method, data) {
    window.postMessage({type: "alpha_msg", method: method, payload: data})
  }

  async request(req) {
    this.sendMessage(req.method, req.params)
  }

  async connect(params = {}) {
    //
    this.sendMessage("connect", {onlyIfTrusted: !!params.onlyIfTrusted})
  }

  async disconnect() {
    this.sendMessage("disconnect")
  }

  async signAndSendTransaction(txn, sendOptions) {
    this.sendMessage("signAndSendTransaction", {
      transaction: txn,
      opts: sendOptions
    })
  }

  async signTransaction(txn) {
    this.sendMessage("signTransaction", {
      transaction: txn
    })
  }

  async signAllTransactions(txns) {
    this.sendMessage("signAllTransactions", {
      transactions: txns
    })
  }

  async signMessage(msg) {
    this.sendMessage("signMessage", {
      message: msg
    })
  }
}

window.alpha = new AlphaConnector()
