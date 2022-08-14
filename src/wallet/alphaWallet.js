import {WalletStorage} from "../storage/walletStorage";
import {ManagerContext} from "../managers/managerContext";
import {TokenManager} from "../managers/tokens/tokenManager";
import {NFTManager} from "../managers/nft/nftManager";
import {SolanaManager} from "../managers/solana/solanaManager";
import {
  MESSAGE_MGR,
  MessageManager
} from "../managers/browser_messages/messageManager";
import {PriceManager} from "../managers/pricing/priceManager";
import {StorageManager} from "../managers/storage/storageManager";
import {KeyStorage} from "../storage/keyStorage";
import {LockManager} from "../managers/core/lockManager";
import {EventManager} from "../managers/core/eventManager";
import {NamespaceManager} from "../managers/core/namespaceManager";
import {PIN_MGR, PinManager} from "../managers/core/pinManager";
import {ConfigManager} from "../managers/core/configManager";
import {TrustedSites} from "../managers/core/trustedSites";

export class AlphaWallet {


  _lockMgr = new LockManager()
  _storageMgr = new StorageManager(new WalletStorage(), new KeyStorage()) //TODO move into lockManager?

  //Raw context
  _managerCtx

  constructor() {
    this._managerCtx = this.newLockedContext()
    this._managerCtx.start()
  }

  /**
   * Default locked wallet state context
   *
   * @returns {ManagerContext}
   */
  newLockedContext() {
    return new ManagerContext([
      new MessageManager(),
      new EventManager(),
      this._storageMgr,
      this._lockMgr,
      new TrustedSites(),
      new PinManager()
    ])
  }

  /**
   * Returns the composition of mangers/plugins to use in the wallet
   *
   * @returns {ManagerContext}
   */
  newWalletContext() {
    return new ManagerContext([
      new MessageManager(),
      //Core
      this._storageMgr,
      this._lockMgr,
      new NamespaceManager(),
      new ConfigManager(),
      new EventManager(),
      new TrustedSites(),
      new PinManager(),
    ])
  }

  /**
   * Register enabled plugins
   */
  registerPlugins() {
    this._managerCtx.addPlugins(
      new SolanaManager(),
      new TokenManager(),
      new NFTManager(),
      new PriceManager()
    )
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
   * @param pincode
   * @returns {Promise<boolean>}
   */
  async unlock(passcode, pincode = null) {
    if (!await this._lockMgr.unlock(passcode, pincode))
      return false

    console.log("Wallet unlocked", new Date())
    this._managerCtx = this.newWalletContext()
    this._managerCtx.start()
    this.registerPlugins()

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
  async onMessage(request, sender) {
    if (!this.getManager(MESSAGE_MGR)) return false

    return this.getManager(MESSAGE_MGR).onMessage(request)
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
   * Returns if the PIN plugin is enabled
   *
   * @returns {boolean}
   */
  isPinPluginEnabled() {
    return this.isPluginEnabled(PIN_MGR)
  }

  /**
   * Returns if the PIN plugin is enabled
   *
   * @returns {boolean}
   */
  async isPinCodeSet() {
    if (!this.isPinPluginEnabled()) {
      console.log("Plugin not enabled")
      return false
    }

    return this.getManager(PIN_MGR).isPinCodeSet()
  }

  /**
   * Returns if a given plugin is enabled
   *
   * @param id
   * @returns {boolean}
   */
  isPluginEnabled(id) {
    return Boolean(this.getManager(id))
  }


  /**
   * Return if the wallet is locker or not
   * @returns Boolean
   */
  isLocked() {
    return this._lockMgr.isLocked()
  }
}
