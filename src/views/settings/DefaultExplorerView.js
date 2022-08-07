import AbstractView from "../../view.js";
import {CFG_MGR} from "../../managers/core/configManager";

export default class DefaultExplorerView extends AbstractView {

  async onClick(e) {
    const selected = e.target.dataset.value
    console.log("Selected", selected)
    await this.getManager(CFG_MGR).setConfigValue("explorer", selected)
    this._router.refresh()
  }

  async getHtml() {
    this.setTitle("Default Explorer");

    const current = this.getManager(CFG_MGR).getConfigValue("explorer")

    return `<h1>${this.title}</h1>

<div class="card ns-card mt-5 ${current === 'solana_fm' ? 'active' : ''}" data-value="solana_fm">
	<div class="card-body ns-card-body p-5">
		<div class="row">
			<div class="col-2">
				<img src="https://solana.fm/favicon.ico" class="img-fluid p-1" alt="solana fm">
			</div>
			<div class="col-10">
				<h3>Solana FM</h3>
				<p><code class="xsmall">https://solana.fm</code></p>
			</div>
		</div>
	</div>
</div>
<div class="card ns-card mt-2 ${current === 'solana_explorer' ? 'active' : ''}" data-value="solana_explorer">
	<div class="card-body ns-card-body p-5">
		<div class="row">
			<div class="col-2">
				<img src="https://explorer.solana.com/favicon.ico" class="img-fluid p-1" alt="solana explorer">
			</div>
			<div class="col-10">
				<h3>Solana Explorer</h3>
				<p><code class="xsmall">https://explorer.solana.com</code></p>
			</div>
		</div>
	</div>
</div>
<div class="card ns-card mt-2 ${current === 'solscan' ? 'active' : ''}" data-value="solscan">
	<div class="card-body ns-card-body p-5">
		<div class="row">
			<div class="col-2">
				<img src="https://solscan.io/favicon.ico" class="img-fluid p-1" alt="solscan">
			</div>
			<div class="col-10">
				<h3>Solscan</h3>
				<p><code class="xsmall">https://solscan.io</code></p>
			</div>
		</div>
	</div>
</div>
<div class="card ns-card mt-2 ${current === 'solanabeach' ? 'active' : ''}" data-value="solana_beach">
	<div class="card-body ns-card-body p-5">
		<div class="row">
			<div class="col-2">
				<img src="https://solanabeach.io/favicon.ico" class="img-fluid p-1" alt="solana_beach">
			</div>
			<div class="col-10">
				<h3>Solana Beach</h3>
				<p><code class="xsmall">https://solanabeach.io</code></p>
			</div>
		</div>
	</div>
</div>`;
  }

  async onMounted(app) {
    super.onMounted(app);

    const elems = document.getElementsByClassName("ns-card")
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", (e) => this.onClick(e))
    }
  }
}
