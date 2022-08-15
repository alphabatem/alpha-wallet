import AbstractView from "../../view.js";
import axios from "axios";
import {web3} from "@project-serum/anchor";
import {NFT_MGR} from "../../managers/nft/nftManager";

export class NFTCard extends AbstractView {
  // _data = {token: {}, price: 0}

  mint

  async onMounted(app) {
    super.onMounted(app);

    this.mint = this._data.token.mint
  }

  async getHtml() {
    const mgr = this.getManager(NFT_MGR)
    const meta = await mgr.getTokenMetadata(new web3.PublicKey(this._data.token.mint)).catch((e) => {
      console.log("Unable to get token metadata", e)
    })
    if (!meta) {
      return ``
    }

    const metadata = meta.data || {}
    const metadataUri = metadata.uri ? metadata.uri.replaceAll("\u0000", "") : null

    let data = null
    if (metadataUri) {
      try {
        const r = await axios({
          method: "get",
          url: metadataUri,
          timeout: 1000,
        }).catch(e => {
        })
        data = r.data
      } catch (e) {
        console.log("Unable to get metadata", e)
      }
    }

    console.log("Data", data, metadata)
    if (!data)
      return ``

    const metaName = metadata.name ? metadata.name.replaceAll("\u0000", "") : ''
    const tokenName = metaName ? metaName : (data.name || this._data.token.mint.substring(0, 16))

    let selectIndicator = ``
    if (this._data.selectActive && this._data.selectStatus) {
      selectIndicator = `<div class="select-indicator"><i class="fi fi-rr-check"></i></div>`
    }

    return `<div class="card m-1 nft-card-container">
    ${selectIndicator}
    <div data-mint="${this._data.token.mint}" class="nft-card" style="background-image: url('${data.image}'); background-size: cover; background-position: center"></div>
		<div class="nft-detail noselect"><span class="small">${tokenName}</span></div>
</div>`
  }
}
