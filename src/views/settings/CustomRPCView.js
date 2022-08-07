import AbstractView from "../../view.js";
import {CFG_MGR} from "../../managers/core/configManager";

export default class CustomRPCView extends AbstractView {
  rpcInput



  async updateConfig(e) {
    await this.getManager(CFG_MGR).setConfigValue("rpcUrl", this.rpcInput.value)
    this._router.navigateTo("settings/rpc")
  }


  async getHtml() {
    this.setTitle("Custom RPC");

    return `
            <h1>${this.title}</h1>

            <div class="row mt-3">
		<div class="col-12 mt-5">
		<h5 class="text-start" style="margin-left: 20px">RPC URL:</h5>
			<input id="uri-input" type="url" required class="form-control mt-2" placeholder="RPC Address">
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="update" class="btn btn-primary btn-block">SAVE</button>
		</div>

	</div>`;
  }

  async onMounted(app) {
    super.onMounted(app)

    this.rpcInput = document.getElementById("uri-input")

    document.getElementById("update").addEventListener("click", (e) => {
      this.updateConfig(e)
    })
  }
}
