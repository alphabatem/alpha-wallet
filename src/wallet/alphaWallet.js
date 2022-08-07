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
  _storageMgr = new StorageManager(new WalletStorage(), new KeyStorage())

  _managerCtx

  constructor() {
    console.log("Loading Alpha Wallet")
    this._managerCtx = this.newLockedContext()
    this._managerCtx.start()
  }


  /**
   * Returns the composition of mangers/plugins to use in the wallet
   *
   * @returns {ManagerContext}
   */
  newWalletContext() {
    return new ManagerContext([
      //Core
      this._storageMgr,
      new ConfigManager(),
      this._lockMgr,
      new NamespaceManager(),
      new EventManager(),
      //Plugins
      new SolanaManager(),
      new MessageManager(),
      new TokenManager(),
      new NFTManager(),
      new PriceManager(),
    ])
  }

  newLockedContext() {
    return new ManagerContext([
      new EventManager(),
      this._storageMgr,
      this._lockMgr,
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

  getStore() {
    return this._storageMgr.getWalletStore()
  }

  getKeyStore(pk) {
    return this._storageMgr.getKeyStore(pk)
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

    //Wallet connected
    return true
  }

  /**
   * Lock the wallet & stop any plugins
   * TODO Move to event "locked"
   *
   * @returns {Promise<void>}
   */
  async lock() {
    console.log("Locking wallet", new Date())
    this._lockMgr.lock()

    //Clear active plugins
    this._managerCtx = this.newLockedContext()
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
    const ws = await this._storageMgr.getWalletStore()
    return ws.isPasscodeSet()
  }


  /**
   * Return if the wallet is locker or not
   * @returns Boolean
   */
  isLocked() {
    return this._lockMgr.isLocked()
  }
}
