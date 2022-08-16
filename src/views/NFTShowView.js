import AbstractView from "../view.js";
import {NFT_MGR} from "../managers/nft/nftManager";
import axios from "axios";
import {TraitCard} from "../components/nfts/TraitCard";

export default class NFTShowView extends AbstractView {

  burnToken(e) {
    e.preventDefault()
    this.getRouter().navigateTo("transfer/burn_nft", {tokens: [this._data.mint]})
  }

  sendToken(e) {
    e.preventDefault()
    this.getRouter().navigateTo("transfer/send_nft", {tokens: [this._data.mint]})
  }

  async getHtml() {
    this.setTitle("NFT Show");

    const mgr = this.getManager(NFT_MGR)
    const nft = await mgr.getTokenMetadata(this._data.mint)

    console.log("NFT", nft)
    const metadata = nft.data || {}
    let tokenName = metadata.name ? metadata.name.replaceAll("\u0000", "") : this._data.mint.substring(0, 16)
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


    let isScam = mgr.isScam(nft, data)
    let isVerified = mgr.isVerified(nft, data)
    let isSuspect = mgr.isTokenSuspect(nft) || mgr.isMetadataSuspect(data)

    if (!tokenName)
      tokenName = data.name

    let traits = ``
    if (data.attributes) {
      for (let i = 0; i < data.attributes.length; i++) {
        const trait = await this.addSubView(TraitCard, {trait: data.attributes[i]}).getHtml()
        traits += `<div class="col-auto mt-1 p-1">${trait}</div>`
      }
    }


    return `
<div class="row">
<div class="col-auto"><h2>${tokenName}</h2></div>
<div class="col-auto text-end me-2">
<button id="send" class="btn btn-primary btn-sm"><i class="fi fi-rr-inbox-out"></i></button>
<button id="burn" class="btn btn-danger btn-sm"><i class="fi fi-rr-flame"></i></button>
</div>
</div>
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
</div>

<div>
<button id="send_2" class="btn btn-primary btn-block mt-2"><i class="fi fi-rr-inbox-out"></i><span class="ms-1">SEND</span></button>
</div>

`;
  }

  async onMounted(app) {
    super.onMounted(app);

    document.getElementById("send").addEventListener("click", (e) => this.sendToken(e))
    document.getElementById("send_2").addEventListener("click", (e) => this.sendToken(e))
    document.getElementById("burn").addEventListener("click", (e) => this.burnToken(e))
  }

  async onDismount() {
    super.onDismount();

    document.getElementById("send").removeEventListener("click", (e) => this.sendToken(e))
    document.getElementById("send_2").removeEventListener("click", (e) => this.sendToken(e))
    document.getElementById("burn").removeEventListener("click", (e) => this.burnToken(e))
  }
}
