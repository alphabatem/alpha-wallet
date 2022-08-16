import {ApprovalView} from "./ApprovalView";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";
import {WALLET_MGR} from "../../managers/wallets/walletManager";
import {NS_MANAGER} from "../../managers/core/namespaceManager";

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
<div class="card-body" style="min-height: 100px">
<span>${req.request.data.message || 'Empty Message'}</span>
</div>
</div>
<p><i class="small">Encoding: ${req.request.data.display || 'Unknown'}</i></p>
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
    this.getRouter().navigateTo("auth/auth_action", {
      callback: (pk) => this.onAuthSuccess(pk)
    })
  }

  async onAuthSuccess(pk) {
    const mgr = this.getManager(SOLANA_MANAGER)
    const req = await this.getRequest()

    const ns = this.getManager(NS_MANAGER).getActiveNamespace()
    const kp = await this.getManager(WALLET_MGR).getKeyPair(ns.key, pk)
    const signature = await mgr.signMessage(req.request.data, kp)
    console.log("Signature", signature, signature.toString())
    this.notifyResponse(signature)
    window.close()
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
