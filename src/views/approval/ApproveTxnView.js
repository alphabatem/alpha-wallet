import {ApprovalView} from "./ApprovalView";
import {MESSAGE_MGR} from "../../managers/browser_messages/messageManager";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";

export default class ApproveTxnView extends ApprovalView {

  allowedKeys = {
    "signAndSendTransaction": true,
    "signTransaction": true,
    "signAllTransactions": true,
  }

  simulationResultContainer
  rawTxnContainer

  async getHtml() {
    this.setTitle("Sign Transaction");



    const req = await this.getRequest()
    console.log("msg", req)


    const uri = new URL(req.sender.origin)


    this.reloadSimulation(); //Trigger Loading simulation result


    //TODO Get config
    //TODO Get site permissions
    //TODO parseTXN

    //TODO flag based on trusted site permissions

    return `
${this.addProgressBar()}
<div class="approve_txn container-fluid">

	<div class="row">
		<div class="col-12 mb-3">
		<h2>${this.title}</h2>

		</div>

		<div class="col-3">
		<div class="logo-container">
            <img alt="favicon"
              src="/icons/icon_128.png"
              class="img-fluid">
          </div>
</div>
		<div class="col-9">
		<p class="mt-1">${uri}</p>
		<p class="small mt-2">Requesting to sign the following transaction</p>
</div>

	</div>

	<div class="col-12 p-3">
		<div class="row">
			<div class="col-4"><h4>336</h4><h6>Created</h6></div>
			<div class="col-4"><h4>33k</h4><h6>Transactions</h6></div>
			<div class="col-4"><h4>1/10</h4><h6>Risk</h6></div>
		</div>

		<div class="row mt-3">
			<div class="col-6 text-start"><span class="small">Simulation</span></div>
			<div class="col-6 text-end"><a id="reload-simulation" class="link small">RELOAD</a></div>
			<div class="col-12 mt-1">
			<div class="card"><div class="card-body" id="simulation-container"><p class="text-center mt-2 mb-2 small">Loading...</p></div></div>
</div>
		</div>


		<div class="row mt-1">
			<div class="col-6 text-start"><span class="small">Raw Transaction</span></div>
			<div class="col-6 text-end"><a id="raw-toggle" class="link small">SHOW</a></div>
			<div class="col-12"><div class="card-body" id="raw-container" style="display: none">${JSON.stringify(req.request)}</div>
		</div>
	</div>

	<div class="row mt-3">
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
    super.onApprove(e)
    console.log("Approved", e)

    //TODO Sign txn

    window.close()
  }

  async getRequest() {
    const req = await super.getRequest()
    if (!this.allowedKeys[req.request.method])
      this.onReject() //Invalid request
    return req
  }

  async simulateResult() {
    const msgMgr = this.getManager(MESSAGE_MGR)
    if (!msgMgr)
      return ``

    const txn = await msgMgr.getRequest();
    return this.getManager(SOLANA_MANAGER).getTransactionManager().analyseTransaction("", txn)
  }

  buildSimulationResultContainer(r) {
    this.simulationResultContainer.innerHTML = ``
  }

  reloadSimulation() {
    this.simulateResult().then((r) => {
      this.buildSimulationResultContainer(r)
    })
  }

  toggleSimulation() {
    this.rawTxnContainer.style.display = this.rawTxnContainer.style.display === "none" ? "unset" : "none"
  }

  async onMounted(app) {
    super.onMounted(app)

    this.simulationResultContainer = document.getElementById("simulation-container")
    this.rawTxnContainer = document.getElementById("raw-container")

    document.getElementById("reload-simulation").addEventListener("click", (e) => this.reloadSimulation())
    document.getElementById("raw-toggle").addEventListener("click", (e) => this.toggleSimulation())

    document.getElementById("approve").addEventListener("click", (e) => this.onApprove(e))
    document.getElementById("reject").addEventListener("click", (e) => this.onReject(e))
  }

  async onDismount() {
    super.onDismount()
    document.getElementById("approve").removeEventListener("click", (e) => this.onApprove(e))
    document.getElementById("reject").removeEventListener("click", (e) => this.onReject(e))
    document.getElementById("reload-simulation").removeEventListener("click", (e) => this.reloadSimulation())
    document.getElementById("raw-toggle").removeEventListener("click", (e) => this.toggleSimulation())
  }
}
