import AbstractView from "../../view.js";

export default class WalletImportView extends AbstractView {
  nameInput
  walletInput

  constructor(router, wallet) {
    super(router, wallet);
    this.setTitle("Import Wallet");
  }

  async importWallet(e) {
    console.log("Importing wallet", this.nameInput.value)
    //TODO
  }

  async getHtml() {

    return `
            <h1>${this.title}</h1>

            <div class="row mt-5">
		<div class="col-12">
			<input autocomplete="off" id="name-input" class="form-control" placeholder="Wallet Name">
		</div>
		<div class="col-12 mt-3"></div>

		<div class="col-12 mt-3">
			<textarea id="wallet-input" class="form-control" rows="5" placeholder="Private Key"></textarea>
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="import-wallet" class="btn btn-primary btn-block p-3">IMPORT</button>

<p class="small mt-3"><i>Never share your private key with anyone.</i></p>
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
