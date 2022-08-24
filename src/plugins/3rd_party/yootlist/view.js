import PluginView from "../../../viewPlugin";
import "./style.css"

export class MainView extends PluginView {

  logo = "https://www.y00ts.com/_next/image?url=%2Fimages%2Fscholarship%2Fy00ts_banner.png&w=640&q=75"


  async getYootStatus(wallet) {
    return await fetch(`https://api.degods.com/scholarships/application/status?solPubkey=${wallet}`).then(r => {
      return r.json()
    })
  }

  appliedView() {
    return `<div class="status mt-4 applied"><h1>Under Review</h1></div>`
  }

  rejectedView() {
    return `<div class="status mt-4 rejected"><h1>Rejected</h1></div>`
  }

  acceptedView() {
    return `<div class="status mt-4 accepted"><h1>Accepted</h1></div>`
  }

  notAppliedView() {
    return `<div class="status mt-4 not-applied"><h1>Not Applied!</h1></div>
<div class="apply-now"><a target="_blank" href="https://www.y00ts.com/scholarship" class="btn-apply">Apply in 45 seconds.</a></div>`
  }

  async getHtml() {
    const wallet = this.getWallet().getStore().getWalletAddr()
    console.log("Wallet", wallet)
    const resp = await this.getYootStatus(wallet)
    console.log("status", resp)


    let status = null
    switch (resp.status) {
      case 0: //Applied
        status =  this.appliedView()
        break
      case 1:
        status =  this.acceptedView()
        break
      case 2:
        status =  this.rejectedView()
        break
      case 3:
        status =  this.notAppliedView()
        break
    }


    return `<div class="container-fluid">
<div class="logo-container"><img class="img-fluid" alt="y00tlist" src="${this.logo}"></div>

<h3 class="mt-10 mb-10">Application Status</h3>
${status}
</div>`
  }
}
