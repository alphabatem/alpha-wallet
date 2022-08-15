import AbstractView from "../view.js";
import {NFT_MGR} from "../managers/nft/nftManager";
import {NFTCard} from "../components/nfts/NFTCard";
import {NS_MANAGER} from "../managers/core/namespaceManager";

export default class NFTView extends AbstractView {

  selectActive = false
  loadSuspectTokens = false

  selectedNFTs = [];

  toggleSelect() {
    this.selectActive = !this.selectActive
    this.selectedNFTs = [];
    this.getRouter().refresh()
  }

  async bulkSend() {
    this.getRouter().navigateTo("transfer/send_nft", {tokens: this.selectedNFTs})
  }

  async bulkBurn() {
    this.getRouter().navigateTo("transfer/burn_nft", {tokens: this.selectedNFTs})
  }

  async getHtml() {
    this.setTitle("NFTs");

    const mgr = this.getManager(NFT_MGR)
    const nfts = await mgr.getNFTs()

    const nftArr = Object.values(nfts.liquid)

    let nftView = ``;
    for (let i = 0; i < nftArr.length; i++) {
      const card = await this.addSubView(NFTCard, {
        token: nftArr[i],
        loadSus: this.loadSuspectTokens,
        selectActive: this.selectActive,
        selectStatus: this.selectedNFTs.indexOf(nftArr[i].mint) > -1
      }).getHtml()
      if (card === ``)
        continue

      nftView += `<div class="col-6">${card}</div>`
    }

    let selectStatus = ``
    if (this.selectActive)
      selectStatus = `<div class="row"><div class="col-auto text-start ps-2 mt-2"><h4>Selected: <span id="selected-count">${this.selectedNFTs.length}</span></h4></div>
<div class="col-4">
<button id="burn-bulk" class="btn btn-sm btn-danger btn-block"><i class="fi fi-rr-flame"></i> BURN</button>
</div>
<div class="col-4">
<button id="send-bulk" class="btn btn-sm btn-primary btn-block"><i class="fi fi-rr-inbox-out"></i> SEND</button>
</div> </div>`


    return `<div class="row">
<div class="col-auto text-start ps-2">
<h1>${this.title}</h1>
</div>
<div class="col-4">
<button id="select-toggle" class="btn btn-sm mt-1 ${this.selectActive ? 'btn-secondary' : 'btn-primary'}"><i class="fi fi-rr-filter"></i> SELECT</button>
</div>
</div>
${selectStatus}

<div class="token-container">
	<div class="row">${nftArr.length > 0 ? nftView : this.noNFTSMessage()}</div>
</div>`;
  }

  noNFTSMessage() {
    return `<div class="col-12 text-center"><i class="small">No NFT\'s Detected</i></div>`
  }


  async beforeMount() {
    const ns = this.getManager(NS_MANAGER).getActiveNamespace()
    if (!ns || ns === "_default") {
      this.getRouter().navigateTo("wallets/swap", {redirect_to: "nft"})
      return false
    }
    return true
  }

  async onMounted(app) {
    super.onMounted(app);

    document.getElementById("select-toggle").addEventListener("click", (e) => this.toggleSelect())

    const elems = document.getElementsByClassName("nft-card")
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", (e) => this.onClick(e))
    }

    const bulkSendBtn = document.getElementById("send-bulk")
    if (bulkSendBtn)
      bulkSendBtn.addEventListener("click", () => this.bulkSend())

    const bulkBurnBtn = document.getElementById("burn-bulk")
    if (bulkBurnBtn)
      bulkBurnBtn.addEventListener("click", () => this.bulkBurn())
  }

  onClick(e) {
    if (this.selectActive) {

      const index = this.selectedNFTs.indexOf(e.target.dataset.mint)
      if (index > -1) {
        this.selectedNFTs.splice(index, 1)
        this.getRouter().refresh()
        return;
      }

      this.selectedNFTs.push(e.target.dataset.mint)
      this.getRouter().refresh()
      return
    }

    this.getRouter().navigateTo("nft/show", {mint: e.target.dataset.mint})
  }
}
