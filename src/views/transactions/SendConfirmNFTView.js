import AbstractView from "../../view.js";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";
import {PRICE_MANAGER} from "../../managers/pricing/priceManager";
import {NFTSlider} from "../../components/nfts/NFTSlider";

export default class SendConfirmNFTView extends AbstractView {

  message

  async onConfirm() {
    console.log("SendConfirmView::TODO - Complete onConfirm")
  }

  async getEstimatedFee() {
    return await this.getManager(SOLANA_MANAGER).rpc().getFeeForMessage(this.message);
  }

  async getHtml() {
    this.setTitle("Confirm Send");

    const networkFee = await this.getEstimatedFee().catch(e => {}) || 0.000005 //TODO handle

    const solPrice = await this.getManager(PRICE_MANAGER).getPrice("11111111111111111111111111111111") //TODO Check for sol price
    const networkFeeUsd = networkFee * solPrice

    const recipient = this._data.recipient || "0x0" //TODO mount check

    let nftView = await this.addSubView(NFTSlider, {
      tokens: this._data.tokens,
    }).getHtml();

    return `
            <h1>${this.title}</h1>

<div class="container-fluid"><div class="row">
<p>You are about to send the following ${this._data.tokens.length} NFT's:</p>
<div class="col-12"><div class="card"><div class="card-body">
${nftView}</div></div></div>

<p class="mt-2">To the following recipient:</p>
<div class="col-12"><div class="card"><div class="card-body py-3">
<code class="address">${recipient}</code></div></div></div>
</div></div>

<div class="row mt-2">
<div class="col-auto">Network Fee</div>
<div class="col-auto">
${networkFee} SOL
</div>
<div class="col-auto">
$${networkFeeUsd.toFixed(5)}
</div>
</div>

<div class="row">
<div class="col-6"><button id="cancel" class="btn btn-secondary btn-block mt-3">Cancel</button></div>
<div class="col-6"><button id="confirm" class="btn btn-primary btn-block mt-3">Send</button></div>
</div>

	</div>`;
  }

  async onMounted(app) {
    super.onMounted(app)

    document.getElementById("confirm").addEventListener("click", (e) => {
      this.onConfirm(e)
    })
    document.getElementById("cancel").addEventListener("click", (e) => {
      this.getRouter().navigateTo("tokens")
    })
  }
}
