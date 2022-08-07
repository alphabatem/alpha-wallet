import {AbstractManager} from "../abstractManager";

export class MessageManager extends AbstractManager {

  id() {
    return MESSAGE_MGR
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
   * Called upon connect from dapp
   *
   * @param data
   */
  connect(data) {
    //
  }

  /**
   * Called upon disconnect from dapp
   *
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


  /**
   * Returns if we can execute message functions or not
   *
   * @returns {boolean}
   * @private
   */
  _canExecute() {
    if (this.getStore().isLocked())
      return false

    return true
  }
}

export const MESSAGE_MGR = "message_mgr"
