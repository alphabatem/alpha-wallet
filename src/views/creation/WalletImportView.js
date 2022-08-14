import AbstractView from "../../view.js";
import {WALLET_MGR} from "../../managers/wallets/walletManager";
import {NS_MANAGER} from "../../managers/core/namespaceManager";

export default class WalletImportView extends AbstractView {
  nameInput
  walletInput

  error = ""

  async importWallet(e) {
    const keypair = this.getManager(WALLET_MGR).decodeKeypair(this.walletInput.value)
    const exists = this.getManager(NS_MANAGER).namespaceExists(keypair.publicKey.toString())
    if (exists) {
      this.error = "Wallet already exists"
      this._router.refresh()
      return
    }

    this.getRouter().navigateTo("auth/auth_action", {
      redirect_to: "tokens",
      callback: (pk) => this.onAuthSuccess(pk)
    })
  }

  async onAuthSuccess(pk) {
    await this.getManager(WALLET_MGR).importWallet(this.nameInput.value, this.walletInput.value, pk)
  }

  async getHtml() {
    this.setTitle("Import Wallet");

    return `
            <h1>${this.title}</h1>

            <p class="small mt-3"><i>Never share your private key with anyone.</i></p>

            <div class="row mt-5">
		<div class="col-12">
			<input autocomplete="chrome-off" id="name-input" class="form-control" placeholder="Wallet Name">
		</div>
		<div class="col-12 mt-3"></div>

		<div class="col-12 mt-3">
			<textarea id="wallet-input" class="form-control" rows="5" placeholder="Private Key"></textarea>
		</div>

		<div class="col-12 text-center mt-3">
		    <p class="text-danger small">${this.error}</p>
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="import-wallet" class="btn btn-primary btn-block p-3">IMPORT</button>
		</div>
	</div>
        `;
  }

  async onMounted(app) {
    await super.onMounted(app)
    this.nameInput = document.getElementById("name-input")
    this.walletInput = document.getElementById("wallet-input")
    document.getElementById("import-wallet").addEventListener("click", (e) => this.importWallet(e))
  }
}
