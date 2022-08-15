import AbstractView from "../../view.js";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";
import {PRICE_MANAGER} from "../../managers/pricing/priceManager";

export default class SendErrorView extends AbstractView {

  async getHtml() {
    this.setTitle("Send Error");

    const txn = this._data.txn
    const recipient = this._data.recipient || "0x0" //TODO mount check
    const txnUri = ``


    return `
            <h1>${this.title}</h1>


    <div class="row">
    <div class="col-12">
    <h1>Unable to Send</h1>

    <p class="small">Unable to send tokens!</p>

    <p class="mt-2"><a target="_blank" href="${txnUri}">View Transaction</a></p>
</div>
</div>

<div class="row mt-5">
<div class="col-12"><button id="back" class="btn btn-primary btn-block mt-3">Done</button></div>
</div>

	</div>`;
  }

  async onMounted(app) {
    super.onMounted(app)

    document.getElementById("back").addEventListener("click", (e) => {
      this.getRouter().navigateTo("tokens")
    })
  }
}
