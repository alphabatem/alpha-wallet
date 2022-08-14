import {ApprovalView} from "./ApprovalView";

export default class ApproveMessageView extends ApprovalView {

  uri = ""

  async getHtml() {
    this.setTitle("Sign Message");

    const req = await this.getRequest()
    console.log("msg", req)


    const uri = new URL(req.sender.origin)
    //TODO Get config
    //TODO Get site permissions

    return `${this.addProgressBar()}
<div class="approve_txn container-fluid">

	<div class="row">
		<div class="col-12 mb-5">
		<h2>${this.title}</h2>

		<p class="mt-1">${uri.host}</p>

		</div>

		<div class="col-3">
		<div class="logo-container">
            <img alt="favicon"
              src="/icons/icon_128.png"
              class="img-fluid">
          </div>
</div>
		<div class="col-9 ps-2 text-start">
		<p class="">Requesting to sign the following message.</p>
		<p class="small mt-2">If you do not recognise the below text proceed with caution!</p>
</div>

	</div>

<div class="row mt-3">

<div class="col-10 mx-auto">
<div class="card">
<div class="card-body">
<span>${req.request.message || 'Empty Message'}</span>
</div>
</div>
<p><i class="small">Encoding: ${req.request.display || 'Unknown'}</i></p>
</div>
</div>

      <div class="row mt-5">

        <div class="col-6">
          <button id="approve"
            class="btn btn-primary btn-block">Approve
          </button>
        </div>
        <div class="col-6">
          <button id="reject"
            class="btn btn-danger btn-block">Reject
          </button>
        </div>
      </div>

    </div>`;
  }


  onApprove(e) {
    //TODO
  }

  async getRequest() {
    const req = await super.getRequest()
    if (req.request.method !== "signMessage")
      this.onReject() //Invalid request
    return req
  }

  async onMounted(app) {
    super.onMounted(app)

    document.getElementById("approve").addEventListener("click", (e) => this.onApprove(e))
    document.getElementById("reject").addEventListener("click", (e) => this.onReject(e))
  }

  async onDismount() {
    super.onDismount()

    document.getElementById("approve").removeEventListener("click", (e) => this.onApprove(e))
    document.getElementById("reject").removeEventListener("click", (e) => this.onReject(e))
  }
}
