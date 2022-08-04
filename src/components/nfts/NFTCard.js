import AbstractView from "../../view.js";
import axios from "axios";

export class NFTCard extends AbstractView {
  // _data = {token: {}, price: 0}

  async getHtml() {

    const metadata = this._data.token.meta ? this._data.token.meta.data : {}
    const tokenName = metadata.name ? metadata.name.replaceAll("\u0000", "") : this._data.token.mint.substring(0, 16)
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

    return `<div class="col-6"><div class="card nft-card m-1" style="background-image: url('${data.image}'); background-size: cover; background-position: center">
		<div class="nft-detail"><span class="small">${tokenName}</span></div>
</div>
</div>`
  }
}
