import AbstractView from "../../view.js";

export default class WalletCreateView extends AbstractView {
  nameInput

  constructor(router, wallet) {
    super(router, wallet);
    this.setTitle("Save Secret");
  }

  async createWallet(e) {
    //TODO add as namespace PK
  }

  async getHtml() {

    return `
            <h1>${this.title}</h1>

            <div class="row mt-5">
		<div class="col-12">
			<input id="name-input" class="form-control" placeholder="Wallet Name">
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
