import AbstractView from "../../view.js";

export default class SendSOLView extends AbstractView {
  recipientInput
  amountInput

  async onConfirm() {

  }

  async getHtml() {
    this.setTitle("Send SOL");

    return `
            <h1>${this.title}</h1>


    <div class="row">

</div>

<div class="row">
<div class="col-6"><button id="cancel" class="btn btn-secondary btn-block mt-3">Cancel</button></div>
<div class="col-6"><button id="cancel" class="btn btn-primary btn-block mt-3">Next</button></div>
</div>

            <div class="row mt-5">
		<div class="col-12">
			<input id="recipient-input" autocomplete="chrome-off" class="form-control" placeholder="Recipient Address">
		</div>
		<div class="col-12">
			<input id="amount-input" autocomplete="chrome-off" class="form-control" placeholder="Amount">
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="update-wallet" class="btn btn-primary btn-block">SAVE</button>
		</div>



		<div class="col-12 text-center mt-3">
		    <button id="remove-wallet" class="btn btn-danger btn-block">REMOVE</button>
		</div>

	</div>`;
  }

  async onMounted(app) {
    super.onMounted(app)

    this.recipientInput = document.getElementById("recipient-input")
    this.amountInput = document.getElementById("amount-input")

    document.getElementById("update-wallet").addEventListener("click", (e) => {
      this.updateWallet(e)
    })
    document.getElementById("remove-wallet").addEventListener("click", (e) => {
      this.removeWallet(e)
    })
  }
}
