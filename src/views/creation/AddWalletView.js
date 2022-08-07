import AbstractView from "../../view.js";

export default class AddWalletView extends AbstractView {

  async getHtml() {

    const walletAddr = await this.getWallet().getStore().getWalletAddr()
    console.log("WalletAddr", walletAddr)
    const walletName = await this.getWallet().getStore().getPlain("wallet_name").catch(e => {
    })

    return `<h1>${this.title}</h1>
<div class="row p-3">
	<div class="col-12 text-center mt-2">
		<div class="card ns-card p-3" data-link="wallets/create">
			<div class="card-body ns-card-body">
				<h4>Create Wallet</h4>
				<p class="small mt-2">Create a new wallet</p>
			</div>
		</div>
		</div>
		<div class="col-12 text-center mt-2">
		<div class="card ns-card p-3" data-link="wallets/import">
			<div class="card-body ns-card-body">
				<h4>Import Wallet</h4>
				<p class="small mt-2">Import an existing wallet</p>
			</div>
		</div>
		</div>
		<div class="col-12 text-center mt-2">
		<div class="card ns-card p-3" data-link="wallets/connect">
			<div class="card-body ns-card-body">
			  <p class="small">(Recommended)</p>
				<h4 class="mt-1">Connect Ledger Wallet</h4>
				<p class="small mt-2">Connect to a hardware wallet</p>
			</div>
		</div>
		</div>
	</div>
</div>`;
  }

  async onMounted(app) {
    await super.onMounted(app)
    this.setTitle("Add Wallet");
  }
}
