import AbstractView from "../view.js";
import {NFT_MGR} from "../managers/nft/nftManager";
import {NFTCard} from "../components/nfts/NFTCard";

export default class NFTView extends AbstractView {
  constructor(router, wallet) {
    super(router, wallet);
    this.setTitle("NFTs");
  }

  async getHtml() {

    const mgr = this.getManager(NFT_MGR)
    const nfts = await mgr.getNFTs()
    console.log("NFTS", nfts)

    const nftArr = Object.values(nfts.liquid)

    let nftView = ``;
    for (let i = 0; i < nftArr.length; i++) {
      nftView += await this.addSubView(NFTCard, {
        token: nftArr[i],
      }).getHtml()
    }

    return `<h1>NFT</h1>

<div class="token-container">
	<div class="row">${nftArr.length > 0 ? nftView : '<i class="small">No NFT\'s Detected</i>'}</div>
</div>`;
  }
}
