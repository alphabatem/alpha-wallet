import AbstractView from "../../view.js";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";
import {PRICE_MANAGER} from "../../managers/pricing/priceManager";

export default class SendConfirmView extends AbstractView {

  message

  async onConfirm() {
    console.log("SendConfirmView::TODO - Complete onConfirm")
  }

  async getEstimatedFee() {
    return await this.getManager(SOLANA_MANAGER).rpc().getFeeForMessage(this.message);
  }

  async getHtml() {
    this.setTitle("Confirm Send");

    const sendAmountHuman = 1;
    const symbol = `SOL`

    const networkFee = this.getEstimatedFee()
    const solPrice = await this.getManager(PRICE_MANAGER).getPrice("11111111111111111111111111111111") //TODO Check for sol price
    const networkFeeUsd = networkFee * solPrice

    const recipient = this._data.recipient || "0x0" //TODO mount check

    return `
            <h1>${this.title}</h1>


    <div class="row">
<div class="card">
<div class="card-body p-3">
<p>You are about to send ${sendAmountHuman} ${symbol} to the following address</p>

<code>${recipient}</code>

<p>Double check this is the correct amount & recipient address.</p>
<p>Once you click send there is no way for this to be reversed.</p>

</div>
</div>
</div>

<div class="row">
<div class="col-6">Network Fee</div>
<div class="col-3">
${networkFee} SOL
</div>
<div class="col-3">
$${networkFeeUsd}
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
