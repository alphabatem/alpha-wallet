export class SolanaAdapter {


  /**
   * Handle inbound message
   *
   * @param request
   * @returns {*}
   */
  onMessage(request) {
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

}
