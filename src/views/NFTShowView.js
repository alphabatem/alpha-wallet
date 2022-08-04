import AbstractView from "../view.js";
import {NFT_MGR} from "../managers/nft/nftManager";
import axios from "axios";

export default class NFTShowView extends AbstractView {
  async getHtml() {
    this.setTitle("NFT Show");

    console.log("Showing NFT", this._data)
    const mgr = this.getManager(NFT_MGR)
    const nft = await mgr.getTokenMetadata(this._data.mint)
    console.log("NFT", nft)

    const metadata = nft.data || {}
    const tokenName = metadata.name ? metadata.name.replaceAll("\u0000", "") : this._data.mint.substring(0, 16)
    const metadataUri = metadata.uri ? metadata.uri.replaceAll("\u0000", "") : null

    let data = null
    if (metadataUri) {
      console.log("Getting uri", metadataUri)
      try {
        const r = await axios({
          method: "get",
          url: metadataUri,
          timeout: 1000,
        }).catch(e => {
          console.log("e", e)
        })
        data = r.data
      } catch (e) {
        //
      }
    }
    if (!data)
      return ``

    return `<h1>${tokenName}</h1>
<img class="img-fluid mt-3" src="${data.image}" alt="">

<div class="row m-1">
<h5>${data.collection ? data.collection.name : "Unknown Collection"}</h5>
<p class="small text-start mt-2" style="line-height: 1em">${data.description}</p>
</div>

<div class="row">
<div class="col-auto"></div>
<div class="col-auto"></div>
<div class="col-auto"></div>
</div>`;
  }
}
