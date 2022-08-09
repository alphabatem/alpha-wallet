import AbstractView from "../../view.js";

export default class WalletNameView extends AbstractView {
  nameInput
  walletInput

  walletAddr


  async updateWallet(e) {
    //
    await this.getWallet().getStore().setWalletAddr(this.walletInput.value)
    await this.getWallet().getStore().setWalletName(this.nameInput.value)

    this._router.navigateTo("settings")
  }

  async removeWallet(e) {
    this._router.navigateTo("wallets/remove", {walletAddr: this.walletAddr})
  }

  async getHtml() {
    this.setTitle("Wallet Name");

    this.walletAddr = await this.getWallet().getStore().getWalletAddr().catch(e => {
    })
    const walletName = await this.getWallet().getStore().getWalletName().catch(e => {
    })

    return `
            <h1>${this.title}</h1>

            <div class="row mt-3">
		<div class="col-12">
			<input id="name-input" autocomplete="chrome-off" class="form-control" placeholder="Wallet Name" value="${walletName}">
		</div>
		<div class="col-12 mt-3"></div>

		<div class="col-12 mt-3">
			<input id="wallet-input" disabled="true" class="form-control" placeholder="Wallet Address" value="${this.walletAddr}">
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="update-wallet" class="btn btn-primary btn-block">SAVE</button>
		</div>

		<hr>


		<div class="col-12 text-center mt-3">
		    <button id="remove-wallet" class="btn btn-danger btn-block">REMOVE</button>
		</div>

	</div>`;
  }

  async onMounted(app) {
    super.onMounted(app)

    this.nameInput = document.getElementById("name-input")
    this.walletInput = document.getElementById("wallet-input")
    document.getElementById("update-wallet").addEventListener("click", (e) => {
      this.updateWallet(e)
    })
    document.getElementById("remove-wallet").addEventListener("click", (e) => {
      this.removeWallet(e)
    })
  }
}
