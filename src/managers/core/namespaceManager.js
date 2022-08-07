import {AbstractManager} from "../abstractManager";
import {DEFAULT_NAMESPACE} from "../../storage/walletStorage";

export const NS_MANAGER = "namespace_manager"

export class NamespaceManager extends AbstractManager {

  _namespaces = [DEFAULT_NAMESPACE];

  id() {
    return NS_MANAGER
  }

  configure(ctx) {
    super.configure(ctx)

    this.getStore().loadNamespaces().then((ns) => {
      console.log("NS loaded", ns)
      this._namespaces = ns
    })
  }

  getActiveNamespace() {
    return this.getStore().getActiveNamespace()
  }

  getNamespaces() {
    return this._namespaces
  }

  async setNamespace(namespace) {
    if (this._namespaces.indexOf(namespace) === -1) {
      throw new Error("invalid namespace")
    }

    console.log("Setting namespace")
    await this.getWallet().getStore().setNamespace(namespace)
  }
}
