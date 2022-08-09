import AbstractView from "../../view.js";

export default class WalletCreateView extends AbstractView {
  nameInput

  async createWallet(e) {
    if (this.nameInput.value.length < 1)
      return

    this.getRouter().navigateTo("wallets/create/save", {name: this.nameInput.value})
  }

  async getHtml() {
    this.setTitle("Create Wallet");

    return `
            <h1>${this.title}</h1>

            <div class="row mt-5">
		<div class="col-12">
			<input id="name-input" autocomplete="chrome-off" class="form-control" placeholder="Wallet Name">
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="create-wallet" class="btn btn-primary btn-block">CREATE</button>
		</div>
	</div>`;
  }
  async onMounted(app) {

    await super.onMounted(app)
    this.nameInput = document.getElementById("name-input")
    document.getElementById("create-wallet").addEventListener("click", (e) => this.createWallet(e))
  }
}
