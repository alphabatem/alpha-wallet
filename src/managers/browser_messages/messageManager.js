import {AbstractManager} from "../abstractManager";

export class MessageManager extends AbstractManager {

  handler = {
    // "solana": null,
    // "ethereum": null
  }

  connected = false


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return MESSAGE_MGR
  }


  eventCallbacks = {
    "connected": null,
    "disconnect": null,
    "sign": null,
    "send": null,
  }

  /**
   *  Fire browser events
   *   events = [
   *     "connect", // {chainID: ""} (object)
   *     "disconnect", // (void)
   *     "accountsChanged",  // ["0x0"] (array) - Wallet Addr
   *     "chainChanged",  // chainID (string)
   *     "message" // {type: "", data: {}}
   *     "error" // {message: "", code: 0, data: {}}
   *   ]
   * @param eventName
   * @param data
   */
  fireEvent(eventName, data) {
    window.dispatchEvent(new CustomEvent(eventName, {detail: data}))
  }

  /**
   * Register message handler for given chain
   * @param chainID
   * @param mgr
   * @returns {null}
   */
  registerHandler(chainID, mgr) {
    if (this.handler[chainID]) {
      console.error(`Unable to register provider ${chainID} already exists`)
      return false
    }

    this.handler[chainID] = mgr
    return true
  }

  /**
   * Handle inbound message
   *
   * @param request
   * @returns {*}
   */
  onMessage(request) {
    console.log("onMessage", request)

    if (!this._canExecute() || !request)
      return false

    //TODO check if this is ok with EVM requests
    if (request.method === "request") {
      request = request.data
    }

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
      case "request":
        return this.onRequest(request)
    }
  }

  isConnected() {
    return this.connected
  }

  defaultProvider() {
    if (Object.keys(this.handler).length === 0)
      throw new Error("no handlers configured")

    return this.handler[Object.keys(this.handler)[0]]
  }

  /**
   * Handle generic request calls
   * @param request
   */
  async onRequest(request) {
    if (request.method === "connect") return this.connect(request.data)
    if (request.method === "disconnect") return this.disconnect(request.data)

    if (!this.isConnected()) return

    if (!request.data)
      request.data = {}

    const providerName = request.provider || request.data.provider || this.defaultProvider() //Provided handler or first handler
    const p = this.handler[providerName]
    if (!p)
      throw new Error("invalid provider")

    return p.request({
      method: request.method,
      data: request.data
    })
  }

  hasHandler(providerName) {
    return !!this.handler[providerName]
  }

  /**
   * Called upon connect from dapp
   *
   * @param data
   */
  connect(data) {
    this.connected = true
    return true
  }

  /**
   * Called upon disconnect from dapp
   *
   * @param data
   */
  disconnect(data) {
    this.connected = false
    return true
  }

  /**
   *
   * @param data
   */
  async signAndSendTransaction(data) {
    const resp = await this.onRequest({method: "signAndSendTransaction", data: data})
    return resp
  }

  /**
   *
   * @param data
   */
  async signTransaction(data) {
    const resp = await this.onRequest({method: "signTransaction", data: data})
    return resp
  }

  /**
   *
   * @param data
   */
  async signAllTransactions(data) {
    const resp = await this.onRequest({method: "signAllTransactions", data: data})
    return resp
  }

  /**
   *
   * @param data
   */
  async signMessage(data) {
    const resp = await this.onRequest({method: "signMessage", data: data})
    return resp
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


  async setRequest(req) {
    return await this.getStore().setPlain("_requests", "message", req)
  }

  async getRequest() {
    return await this.getStore().getPlain("_requests", "message")
  }

  async setResponse(resp) {
    return await this.getStore().setPlain("_requests", "response", resp)
  }
}

export const MESSAGE_MGR = "message_mgr"
