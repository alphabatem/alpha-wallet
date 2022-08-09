import AbstractView from "../../view.js";
import {TRUSTED_SITE_MGR} from "../../managers/core/trustedSites";

export default class ApproveTrustedSiteView extends AbstractView {

  uri = ""

  maxSpend = 10 //10 SOL
  autoSignTxn = false
  autoSignMsg = false
  tokenBalances = ["*"]
  autoSignLimit = 5

  async getHtml() {
    this.setTitle("Approval");

    const previousConnections = 3000
    const firstConnection = new Date().toLocaleDateString()

    let askingForAllTokens = false
    let allowedTokens = ``
    for (let i = 0; i < this.tokenBalances.length; i++) {
      if (this.tokenBalances[i] === "*") {
        askingForAllTokens = true
        allowedTokens = `<span class="badge bg-primary px-4 py-2 float-end">ALL</span>`
        break
      }

      const name = this.tokenBalances[i] === "*" ? "ALL" : this.tokenBalances[i]
      allowedTokens += `<span class="badge bg-primary px-4 py-2 float-end">${name}</span>`
    }

    return `<div class="trusted_site container-fluid">

      <div class="row text-center">
        <div class="col-4">
          <div class="logo-container bg-secondary p-2">
            <img alt="favicon"
              src="/icons/icon_128.png"
              class="img-fluid">
          </div>
        </div>

        <div class="col-8 text-start p-2">
          <h4 id="site_title">AlphaBatem Metaverse</h4>
          <p class="small" id="site_url">metaverse.alphabatem.com</p>
          <div class="detail mt-3">
            <p class="xsmall mono">Connections: <span
              class="badge bg-secondary px-2 float-end"
              id="site_connections">${previousConnections}</span>
            </p>
            <p class="xsmall mono">First Connect: <span
              class="badge bg-secondary px-2 float-end"
              id="site_first_connect">${firstConnection}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="permissions text-start mt-3">
        <div class="col-12">
          <h5>PERMISSIONS:</h5>
        </div>

        <div class="col-12 mt-4 permission-item">
          <span>Max Balance & Spend: </span>
          <span class="badge bg-primary px-4 py-2 float-end">${this.maxSpend} SOL</span>
        </div>

        <div class="col-12 mt-4 permission-item">
          <span>Token Balances: </span>
          ${allowedTokens}
        </div>

        <div class="col-12 mt-4 permission-item">
          <span>Auto Sign TXN: </span>
          <span class="badge bg-secondary px-4 py-2 float-end">${this.autoSignTxn ? 'ON' : 'OFF'}</span>
        </div>

        <div class="col-12 mt-4 permission-item">
          <span>Auto Sign MSG: </span>
          <span class="badge bg-secondary px-4 py-2 float-end">${this.autoSignMsg ? 'ON' : 'OFF'}</span>
        </div>

        <div class="col-12 mt-4 permission-item">
          <span>Auto Sign Limit: </span>
          <span class="badge bg-secondary px-4 py-2 float-end">${this.autoSignLimit}</span>
        </div>
      </div>

      ${askingForAllTokens ? `<div class="col-12">
        <p class="text-danger xsmall mt-3">Warning: <i>This site will have
          access
          to all
          token balances!</i></p>
      </div>` : ''}
      <div class="row mt-3">

        <div class="col-6">
          <button id="approve"
            class="btn btn-primary btn-block">Approve
          </button>
        </div>
        <div class="col-6">
          <button id="reject"
            class="btn btn-secondary btn-block">Cancel
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

    //TODO Notify bg to allow connections

    window.close()
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
