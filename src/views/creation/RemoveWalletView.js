import AbstractView from "../../view.js";
import {NS_MANAGER} from "../../managers/core/namespaceManager";

export default class RemoveWalletView extends AbstractView {

  walletToRemove

  async removeWallet() {
    if (!this.walletToRemove)
      return

    console.log("Removing namespace", this.walletToRemove)
    await this.getManager(NS_MANAGER).removeNamespace(this.walletToRemove)
    this._router.navigateTo("wallets/swap")
  }

  async onCancel(e) {
    console.log("onCancel")
    await this._router.back()
  }

  async getHtml() {
    this.setTitle("Remove Wallet");
    this.walletToRemove = this._data.walletAddr

    return `<h1>${this.title}</h1>
<div>
<p class="small mt-3">Are you sure you want to delete this wallet?</p>

<p class="mt-3"><code class="xsmall">${this.walletToRemove}</code></p>

<button id="confirm" class="btn btn-danger btn-block mt-5">Remove Wallet</button>
<button id="cancel" class="btn btn-secondary btn-block mt-3">Cancel</button>
</div>`;
  }

  async onMounted(app) {
    await super.onMounted(app)


    document.getElementById("confirm").addEventListener("click", (e) => this.removeWallet(e))
    document.getElementById("cancel").addEventListener("click", (e) => this.onCancel(e))
  }
}
