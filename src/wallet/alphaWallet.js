import {SolanaAdapter} from "../chains/solana";

export class AlphaWallet {

  //Chain adapters
  adapters = {
    "solana": new SolanaAdapter()
  }


  /**
   * Called from our background script on a page event
   * @param request
   * @param sender
   * @param sendResponse
   * @returns {Promise<void>}
   */
  async onMessage(request, sender, sendResponse) {
    if (!this.adapters[request.provider]) {
      console.error("adapter not registered", request.provider)
      return
    }

    const response = await this.adapters[request.provider].onMessage(request, sender)
    sendResponse(response) //TODO check
  }

  getAdapter(adapter) {
    return this.adapters[adapter]
  }

}
