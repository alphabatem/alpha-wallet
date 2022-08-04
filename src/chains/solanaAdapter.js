import {SolanaRPC} from "./solanaRpc";

export class SolanaAdapter {
  walletStore
  rpc

  constructor(storage) {
    this.walletStore = storage

    //Get config & load rpc settings
    this.walletStore.getConfig().then(cfg => {
      this.rpc = new SolanaRPC(cfg.rpcUrl, cfg.commitment)
    }).catch(e => {
      console.error("getConfig err", e)
    })
  }


  /**
   * Handle inbound message
   *
   * @param request
   * @returns {*}
   */
  onMessage(request) {
    if (!this._canExecute())
      return false

    switch (request.method) {
      case "connect":
        return this.connect(request.data)
      case "disconnect":
        return this.disconnect(request.data)
      case "signAndSendTransaction":
        return this.signAndSendTransaction(request.data)
      case "signTransaction":
        return this.signTransaction(request.data)
      case "signAllTransactions":
        return this.signAllTransactions(request.data)
      case "signMessage":
        return this.signMessage(request.data)
    }
  }

  /**
   * Return the users Solana Address
   * @returns {string}
   */
  getAddress() {
    return "0x0"
  }


  /**
   * Called upon connect from dapp
   * @param data
   */
  connect(data) {
    //
  }

  /**
   * Called upon disconnect from dapp
   * @param data
   */
  disconnect(data) {
    //
  }

  /**
   *
   * @param data
   */
  signAndSendTransaction(data) {
    //
  }

  /**
   *
   * @param data
   */
  signTransaction(data) {
    //
  }

  /**
   *
   * @param data
   */
  signAllTransactions(data) {
    //
  }

  /**
   *
   * @param data
   */
  signMessage(data) {
    //
  }


  _canExecute() {
    if (this.walletStore.isLocked() || !this.rpc)
      return false

    return true
  }
}
