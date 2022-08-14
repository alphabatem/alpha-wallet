import AbstractView from "../view.js";
import {NFT_MGR} from "../managers/nft/nftManager";
import {NFTCard} from "../components/nfts/NFTCard";
import {NS_MANAGER} from "../managers/core/namespaceManager";

export default class NFTView extends AbstractView {
  async getHtml() {
    this.setTitle("NFTs");

    const mgr = this.getManager(NFT_MGR)
    const nfts = await mgr.getNFTs()

    const nftArr = Object.values(nfts.liquid)

    let nftView = ``;
    for (let i = 0; i < nftArr.length; i++) {
      nftView += await this.addSubView(NFTCard, {
        token: nftArr[i],
      }).getHtml()
    }

    return `<h1>${this.title}</h1>

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

    const elems = document.getElementsByClassName("nft-card")
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", (e) => this.onClick(e))
    }
  }

  onClick(e) {
    this.getRouter().navigateTo("nft/show", {mint: e.target.dataset.mint})
  }
}
