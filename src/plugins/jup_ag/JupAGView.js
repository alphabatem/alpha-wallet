import AbstractView from "../../view.js";
import {JupAg} from "./jup_ag";

export default class JupAGView extends AbstractView {

  api

  async onMounted(app) {
    await super.onMounted(app);

    this.api = new JupAg()
  }

  async getHtml() {
    this.setTitle("Transfer");

    return `<div class="swap text-center">
	<h1>Transfer</h1>
	<p>Powered By Jupiter AG</p>

	<div class="row mt-3">
		<div class="col-12">
			<input class="form-control" placeholder="Input Token">
		</div>
		<div class="col-12 mt-3"></div>

		<div class="col-12 mt-3">
			<input class="form-control" placeholder="Output Token">
		</div>

		<div class="col-12 text-center mt-3">
		    <button class="btn btn-primary btn-block">SWAP</button>
		</div>
	</div>
</div>`;
  }
}
