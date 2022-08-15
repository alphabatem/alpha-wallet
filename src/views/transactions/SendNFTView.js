import AbstractView from "../../view";
import {NFTCard} from "../../components/nfts/NFTCard";
import {NFTSlider} from "../../components/nfts/NFTSlider";

export class SendNFTView extends AbstractView {

  async onSend(e) {
    if (this.input.value.length < 32)
      return

    this.getRouter().navigateTo("transfer/confirm/nfts", {
      recipient: this.input.value,
      tokens: this._data.tokens
    })
  }

  async getHtml() {
    this.setTitle("Send NFTs")

    console.log("Tokens", this._data.tokens)


    //TODO Send multiple tokens

    //TODO Get recipient

    const nftArr = this._data.tokens
    let nftView = await this.addSubView(NFTSlider, {
        tokens: this._data.tokens,
      }).getHtml();

    return `<h1 class="mb-2">${this.title}</h1>

    ${nftView}

    <div class="row mt-5"><div class="col-12">
    <input id="input" class="form-control" placeholder="Recipient Address">
</div></div>

		<div class="col-12 text-center mt-3">
		    <button id="send-tokens" class="btn btn-primary btn-block">SEND ${nftArr.length} TOKENS</button>
		</div>
    `;
  }

  async onMounted(app) {
    super.onMounted(app);

    this.input = document.getElementById("input")
    document.getElementById("send-tokens").addEventListener("click", (e) => this.onSend(e))
  }

  async onDismount() {
    super.onDismount();

    document.getElementById("send-tokens").removeEventListener("click", (e) => this.onSend(e))
  }

}
