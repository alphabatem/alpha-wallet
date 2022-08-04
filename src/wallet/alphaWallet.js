import {SolanaAdapter} from "../chains/solanaAdapter";
import {WalletStorage} from "../storage/walletStorage";
import {ManagerContext} from "../managers/managerContext";
import {TokenManager} from "../managers/tokenManager";
import {NFTManager} from "../managers/nftManager";
import {SolanaManager} from "../managers/solanaManager";
import {Router} from "../router";

export class AlphaWallet {

  router

  walletStore

  managerCtx

  //Chain adapters
  adapters = {
    "solana": null
  }


  constructor() {
    this.walletStore = new WalletStorage()
    this.router = new Router()

    this.managerCtx = new ManagerContext([
      new SolanaManager(this.walletStore),
      new TokenManager(this.walletStore),
      new NFTManager(this.walletStore),
      //TODO Transfer manager?
    ]).start()

    //Event listeners
    this.adapters["solana"] = new SolanaAdapter(this.walletStore)
  }

  unlock(passcode) {
    this.walletStore.unlock(passcode)
  }

  lock() {
    this.walletStore.lock()
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
