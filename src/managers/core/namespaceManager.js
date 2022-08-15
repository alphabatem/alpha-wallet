import {AbstractManager} from "../abstractManager";
import {EVENTS, EVENT_MGR} from "./eventManager";

export const NS_MANAGER = "namespace_manager"

export class NamespaceManager extends AbstractManager {

  _namespaces = [];

  walletHeader


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return NS_MANAGER
  }

  configure(ctx) {
    super.configure(ctx)

    this.walletHeader = document.getElementById("wallet_addr")
    this.getStore().loadNamespaces().then((ns) => {
      console.log("NS loaded", ns)
      this._namespaces = ns
    })
  }

  namespaceExists(walletAddr) {
    return !!this._namespaces.find((ns) => ns.key === walletAddr)
  }

  getActiveNamespace() {
    const ans = this.getStore().getActiveNamespace();
    return this._namespaces.find((ns) => ns.key === ans)
  }

  async getNamespaces() {
    if (this._namespaces.length === 0)
      this._namespaces = await this.getStore().loadNamespaces()

    return this._namespaces
  }

  async addNamespace(walletAddr, name) {
    if (this._namespaces.find((n) => n.key === walletAddr)) {
      throw new Error("namespace already exists")
    }
    this._namespaces.push({
      key: walletAddr,
      name: name
    })

    return this.getStore().storeNamespaces(this._namespaces)
  }

  async removeNamespace(walletAddr) {
    const ns = this._namespaces.filter((n) => n.key !== walletAddr)
    await this.getStore().storeNamespaces(ns)
    this._namespaces = ns
  }

  async setActiveNamespace(namespace) {
    if (!this._namespaces.find((n) => n.key === namespace)) {
      throw new Error("invalid namespace")
    }

    console.log("Setting namespace", namespace)
    this.updateWalletHeader(namespace)
    await this.getStore().setNamespace(namespace)
    this.notify(EVENTS.onWalletSelect)
  }

  updateWalletHeader(ns) {
    this.walletHeader.dataset.addr = ns
    this.walletHeader.innerText = `${ns.substring(0, 6)}...${ns.substring(ns.length - 6)}`
  }

  /**
   * Notify event bus of lock/unlock events
   *
   * @param event
   */
  notify(event) {
    const mgr = this.getManager(EVENT_MGR)
    if (!mgr) return

    mgr.onEvent(event)
  }
}
