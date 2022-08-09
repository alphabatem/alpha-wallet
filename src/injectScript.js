class AlphaConnector {
  isConnected = false

  isAlphaWallet = true

  eventCallbacks = {
    "connected": null,
    "disconnect": null,
    "sign": null,
    "send": null,
  }

  constructor() {
  }

  sendMessage(method, data) {
    window.postMessage({type: "alpha_msg", method: method, payload: data})
  }

  on(method, callback) {
    if (!this.eventCallbacks[method])
      return

    this.eventCallbacks[method] = callback
  }

  async connect() {
    //
    this.sendMessage("connect")
    this.isConnected = true
  }

  async disconnect() {
    this.sendMessage("disconnect")
    this.isConnected = false
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
