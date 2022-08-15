import AbstractView from "../view.js";
import {NFT_MGR} from "../managers/nft/nftManager";
import axios from "axios";
import {TraitCard} from "../components/nfts/TraitCard";

export default class NFTShowView extends AbstractView {

  validHosts = {
    "ipfs.io": true,
    "arweave.net": true,
    "nftstorage.link": true,
    "shdw-drive.genesysgo.net": true,
    "testlaunchmynft.mypinata.cloud": true,
  }

  isScam(nft, metadata) {
    if (!nft.data || !nft.data.creators)
      return true

    if (!metadata.attributes)
      return true

    if (nft.data.sellerFeeBasisPoints !== metadata.seller_fee_basis_points)
      return true

    return false
  }

  isSuspectUrl(nft, metadata) {
    const nftUri = new URL(nft.data.uri.replaceAll("\u0000", ""))
    if (!this.validHosts[nftUri.host])
      return true
    const metadataUri = new URL(metadata.image)
    if (!this.validHosts[metadataUri.host])
      return true

    if (metadata.description.indexOf("://") > -1)
      return true

    if (metadata.attributes) {
      for (let i = 0; i < metadata.attributes.length; i++) {
        if (`${metadata.attributes[i].value}`.indexOf("://") > -1)
          return true
      }
    }

    return false
  }

  isVerified(nft, metadata) {
    if (!nft.data || !nft.data.creators)
      return false

    if (!nft.data.creators[0].verified)
      return false

    return false
  }

  async getHtml() {
    this.setTitle("NFT Show");

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


    let isScam = this.isScam(nft, data)
    let isVerified = this.isVerified(nft, data)
    let isSuspect = this.isSuspectUrl(nft, data)

    let traits = ``
    if (data.attributes) {
      for (let i = 0; i < data.attributes.length; i++) {
        const trait = await this.addSubView(TraitCard, {trait: data.attributes[i]}).getHtml()
        traits += `<div class="col-auto mt-1 p-1">${trait}</div>`
      }
    }


    return `<h2>${tokenName}</h2>
<div class="col-12 pos-relative">
<div class="badge-container">
${isScam ? '<div class="badge bg-danger">SCAM</div>' : ''}
${isSuspect ? '<div class="badge bg-warning">POTENTIAL SCAM</div>' : ''}
${!isVerified ? '<div class="badge bg-secondary">Unverified</div>' : ''}
</div>
<img class="img-fluid mt-3" src="${data.image}" alt="">
</div>

<div class="row m-1">
<div class="col-auto text-start"><h5>${data.collection ? data.collection.name : "Unknown Collection"}</h5></div>
<div class="col-auto text-end"><h5>Royalties: ${metadata.sellerFeeBasisPoints / 100}%</h5></div>
<div class="col-12">
<p class="text-start mt-2" style="line-height: 1em">${data.description}</p>
</div>
</div>

<div class="container-fluid row">
${traits}
</div>`;
  }
}
