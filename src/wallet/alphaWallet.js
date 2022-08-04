import {WalletStorage} from "../storage/walletStorage";
import {ManagerContext} from "../managers/managerContext";
import {TokenManager} from "../managers/tokens/tokenManager";
import {NFTManager} from "../managers/nft/nftManager";
import {SolanaManager} from "../managers/solana/solanaManager";
import {MessageManager} from "../managers/browser_messages/messageManager";
import {PriceManager} from "../managers/pricing/priceManager";

export class AlphaWallet {

  walletStore

  managerCtx

  constructor() {
    this.walletStore = new WalletStorage()
  }


  /**
   * Returns the composition of mangers/plugins to use in the wallet
   *
   * @returns {ManagerContext}
   */
  newWalletContext() {
    return new ManagerContext([
      new SolanaManager(this.walletStore),
      new MessageManager(this.walletStore),
      new TokenManager(this.walletStore),
      new NFTManager(this.walletStore),
      new PriceManager(),
      //TODO Transfer manager?
    ])
  }

  /**
   * Return a manager from our shared context
   *
   * @param id
   * @returns {*}
   */
  getManager(id) {
    return this.managerCtx.getManager(id)
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
    const walletName = await this.walletStore.getPlain("wallet_name").catch(e => {
    })

    this.managerCtx = this.newWalletContext()
    this.managerCtx.start()

    setTimeout(() => this.lock(), cfg.lockTimeout)

    //Wallet connected
    this.onUnlocked({wallet_addr: walletAddr, wallet_name: walletName, cfg})
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

  /**
   * Returns if the passcode has been set before
   * @returns {Promise<*|boolean>}
   */
  async isPasscodeSet() {
    return this.walletStore.isPasscodeSet()
  }


  /**
   * Return if the wallet is locker or not
   * @returns Boolean
   */
  isLocked() {
    return this.walletStore.isLocked()
  }


  /**
   * Return wallet store
   *
   * @returns WalletStorage
   */
  getStore() {
    return this.walletStore
  }

  /**
   * Event - Called when wallet is unlocked
   * @param cfg
   */
  onUnlocked(cfg) {
    const e = new CustomEvent("unlock", {detail: cfg})
    document.dispatchEvent(e)
  }
}
