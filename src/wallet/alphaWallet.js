import {WalletStorage} from "../storage/walletStorage";
import {ManagerContext} from "../managers/managerContext";
import {TokenManager} from "../managers/tokens/tokenManager";
import {NFTManager} from "../managers/nft/nftManager";
import {SolanaManager} from "../managers/solana/solanaManager";
import {MessageManager} from "../managers/browser_messages/messageManager";
import {PriceManager} from "../managers/pricing/priceManager";
import {StorageManager} from "../managers/storage/storageManager";
import {KeyStorage} from "../storage/keyStorage";
import {CFG_MGR, ConfigManager} from "../managers/core/configManager";
import {LockManager} from "../managers/core/lockManager";
import {EventManager} from "../managers/core/eventManager";
import {NamespaceManager} from "../managers/core/namespaceManager";

export class AlphaWallet {

  _lockMgr = new LockManager()

  _managerCtx

  constructor() {
    console.log("Loading Alpha Wallet")
  }


  /**
   * Returns the composition of mangers/plugins to use in the wallet
   *
   * @returns {ManagerContext}
   */
  newWalletContext() {
    return new ManagerContext([
      //Core
      new ConfigManager(),
      this._lockMgr,
      new NamespaceManager(),
      new EventManager(),
      new StorageManager(new WalletStorage(), new KeyStorage()),

      //Plugins
      new SolanaManager(),
      new MessageManager(),
      new TokenManager(),
      new NFTManager(),
      new PriceManager(),
    ])
  }

  /**
   * Return a manager from our shared context
   *
   * @param id
   * @returns {*}
   */
  getManager(id) {
    return this._managerCtx.getManager(id)
  }

  /**
   * Attempt to unlock the wallet
   *
   * @param passcode
   * @returns {Promise<boolean>}
   */
  async unlock(passcode) {
    if (!await this._lockMgr.unlock(passcode))
      return false

    console.log("Wallet unlocked", new Date())

    this._managerCtx = this.newWalletContext()
    this._managerCtx.start()

    const cfg = await this.getManager(CFG_MGR).getConfig()
    //TODO Wallet name

    //Wallet connected
    this.onUnlocked({wallet_addr: "0x0", wallet_name: "TODO", cfg})
    return true
  }

  /**
   * Lock the wallet & stop any plugins
   *
   * @returns {Promise<void>}
   */
  async lock() {
    console.log("Locking wallet", new Date())
    this._lockMgr.lock()

    this.passcode = null

    //Clear active plugins
    this._managerCtx = null
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
    return this._lockMgr.getStore().isPasscodeSet()
  }


  /**
   * Return if the wallet is locker or not
   * @returns Boolean
   */
  isLocked() {
    return this._lockMgr.isLocked()
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
