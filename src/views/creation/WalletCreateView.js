import AbstractView from "../../view.js";
import {WALLET_MGR} from "../../managers/wallets/walletManager";
import {STORAGE_MGR} from "../../managers/storage/storageManager";

export default class WalletCreateView extends AbstractView {
  nameInput

  async createWallet(e) {
    e.preventDefault()
    console.debug("Creating wallet")

    if (this.nameInput.value.length < 1) {
      console.debug("Wallet name too short")
      return
    }

    const ks = await this.getManager(STORAGE_MGR).getKeyStore()
    if (!ks)
      return

    const isSet = await ks.isMnemonicSet()
    if (isSet) {
      this.getRouter().navigateTo("auth/auth_action", {
        redirect_to: "tokens",
        callback: (pk) => this.onAuthSuccess(pk)
      })
      return
    }

    this.getRouter().navigateTo("wallets/create/save", {name: this.nameInput.value})
  }

  async onAuthSuccess(pk) {
    await this.getManager(WALLET_MGR).addWallet(this.nameInput.value, pk).catch(e => {
      console.error("Unable to add wallet", e)
    })
  }

  async getHtml() {
    this.setTitle("Create Wallet");

    return `
            <h1>${this.title}</h1>
<form method="post" id="wallet-form">
            <div class="row mt-5">
		<div class="col-12">
			<input id="name-input" autocomplete="chrome-off" class="form-control" placeholder="Wallet Name">
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="create-wallet" class="btn btn-primary btn-block">CREATE</button>
		</div>
	</div></form>`;
  }

  async onMounted(app) {
    await super.onMounted(app)
    this.nameInput = document.getElementById("name-input")
    this.nameInput.focus()
    document.getElementById("wallet-form").addEventListener("submit", (e) => this.createWallet(e))
    document.getElementById("create-wallet").addEventListener("click", (e) => this.createWallet(e))
  }

  async onDismount() {
    super.onDismount();
    document.getElementById("wallet-form").removeEventListener("submit", (e) => this.createWallet(e))
    document.getElementById("create-wallet").removeEventListener("click", (e) => this.createWallet(e))
  }
}
