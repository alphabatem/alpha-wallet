import {SolanaAdapter} from "../chains/solanaAdapter";
import {WalletStorage} from "../storage/walletStorage";
import {ManagerContext} from "../managers/managerContext";
import {TokenManager} from "../managers/tokenManager";
import {NFTManager} from "../managers/nftManager";
import {SolanaManager} from "../managers/solanaManager";

export class AlphaWallet {

  walletStore

  managerCtx

  //Chain adapters
  adapters = {
    "solana": null
  }

  constructor() {
    this.walletStore = new WalletStorage()
  }


  /**
   * Returns if the passcode has been set before
   * @returns {Promise<*|boolean>}
   */
  async isPasscodeSet() {
    return this.walletStore.isPasscodeSet()
  }


  isLocked() {
    return this.walletStore.isLocked()
  }

  /**
   * Attempt to unlock the wallet
   *
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async unlock(passcode) {
    if (!await this.walletStore.unlock(passcode))
      return false

    console.log("Wallet unlocked", new Date())

    const cfg = await this.walletStore.getConfig().catch(e => console.log("config fetch err", e))
    const walletAddr = await this.walletStore.getWalletAddr()
    const walletName = await this.walletStore.getPlain("wallet_name").catch(e => {})

    this.managerCtx = new ManagerContext([
      new SolanaManager(this.walletStore),
      new TokenManager(this.walletStore),
      new NFTManager(this.walletStore),
      //TODO Transfer manager?
    ]).start()


    //Event listeners
    this.adapters["solana"] = new SolanaAdapter(this.walletStore)

    setTimeout(() => this.lock(), cfg.lockTimeout)

    //Wallet connected
    this.onConnected({wallet_addr: walletAddr, wallet_name: walletName, cfg})
    return true
  }

  /**
   * Lock the wallet & stop any plugins
   *
   * @returns {Promise<void>}
   */
  async lock() {
    console.log("Locking wallet", new Date())
    this.walletStore.lock()

    this.passcode = null

    //Clear active plugins
    this.managerCtx = null
    this.adapters = {}
  }

  /**
   * Called from our background script on a page event
   *
   * @param request
   * @param sender
   * @param sendResponse
   * @returns {Promise<void>}
   */
  async onMessage(request, sender, sendResponse) {
    console.log("alphaWallet:onMessage", request, sender)

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


  getStore() {
    return this.walletStore
  }

  onConnected(cfg) {
    const e = new CustomEvent("unlock", {detail: cfg})
    document.dispatchEvent(e)
  }
}
