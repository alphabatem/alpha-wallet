import AbstractView from "../../view.js";

export default class ApproveTxnView extends AbstractView {

  uri = ""

  maxSpend = 10 //10 SOL
  autoSignTxn = false
  autoSignMsg = false
  tokenBalances = ["*"]
  autoSignLimit = 5

  async getHtml() {
    this.setTitle("Approve Transaction");

    //TODO Get config
    //TODO Get site permissions
    //TODO parseTXN

    //TODO flag based on trusted site permissions

    return `<div class="approve_txn container-fluid">

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
    console.log("Approved", e)

    this.getManager(TRUSTED_SITE_MGR).addTrustedSite(this.uri, {
      maxSpend: this.maxSpend,
      autoSignTxn: this.autoSignTxn,
      autoSignMsg: this.autoSignMsg,
      tokenBalances: this.tokenBalances,
      autoSignLimit: this.autoSignLimit
    })

  }

  onReject(e) {
    console.log("Rejected", e)
    window.close()
  }

  async onMounted(app) {
    super.onMounted(app)

    document.getElementById("approve").addEventListener("click", (e) => this.onApprove(e))
    document.getElementById("reject").addEventListener("click", (e) => this.onReject(e))
  }

  async onDismount() {
    document.getElementById("approve").removeEventListener("click", (e) => this.onApprove(e))
    document.getElementById("reject").removeEventListener("click", (e) => this.onReject(e))
  }
}
