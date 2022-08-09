import AbstractView from "../view.js";
import {NamespaceCard} from "../components/wallet/NamespaceCard";
import {NS_MANAGER} from "../managers/core/namespaceManager";

export default class SwapWalletView extends AbstractView {


  async onClick(e) {
    const ns = e.target.dataset.namespace
    if (!ns)
      return

    await this.getManager(NS_MANAGER).setActiveNamespace(ns)
    this.getRouter().navigateTo("tokens")
  }

  async getHtml() {
    this.setTitle("Wallets");

    const namespaces = await this.getManager(NS_MANAGER).getNamespaces()
    let walletCards = ``
    for (let i = 0; i < namespaces.length; i++) {
      walletCards += await this.addSubView(NamespaceCard, {namespace: namespaces[i]}).getHtml()
    }

    return `
            <h1>${this.title}</h1>

            <div class="row mt-3">
            ${walletCards}
	</div>
	<div class="mt-3">
	<button data-link="wallets/add" class="btn btn-primary btn-block p-3">New/Add Wallet</button>
</div>
        `;
  }

  async onMounted(app) {
    await super.onMounted(app)
    this.nameInput = document.getElementById("name-input")
    this.walletInput = document.getElementById("wallet-input")

    const elems = document.getElementsByClassName("ns-card")
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", (e) => this.onClick(e))
    }
  }
}
