function sendMessage(method, data) {
  window.postMessage({type: "FROM_PAGE", method: method, payload: data})
}

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

  on(method, callback) {
    if (!this.eventCallbacks[method])
      return

    this.eventCallbacks[method] = callback
  }

  async connect() {
    //
    sendMessage("connect")
    this.isConnected = true
  }

  async disconnect() {
    sendMessage("disconnect")
    this.isConnected = false
  }

  async signAndSendTransaction(txn, sendOptions) {
    sendMessage("signAndSendTransaction", {
      transaction: txn,
      opts: sendOptions
    })
  }

  async signTransaction(txn) {
    sendMessage("signTransaction", {
      transaction: txn
    })
  }

  async signAllTransactions(txns) {
    sendMessage("signAllTransactions", {
      transactions: txns
    })
  }

  async signMessage(msg) {
    sendMessage("signMessage", {
      message: msg
    })
  }
}

window.alpha = new AlphaConnector()
