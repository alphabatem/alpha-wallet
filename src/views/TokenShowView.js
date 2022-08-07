import AbstractView from "../view.js";
import {TOKEN_MGR} from "../managers/tokens/tokenManager";
import axios from "axios";
import {SOLANA_MANAGER} from "../managers/solana/solanaManager";
import {TransactionCard} from "../components/transactions/transactionCard";

export default class TokenShowView extends AbstractView {

  async getTokenDetail(token) {
    const usdPrice = (token.amount.uiAmount * (this._data.price || 0)).toLocaleString("en-US", {
      style: 'currency',
      currency: "USD"
    })

    const metadata = token.meta ? token.meta.data : {}
    const tokenName = metadata.name ? metadata.name.replaceAll("\u0000", "") : token.mint.substring(0, 16)
    const metadataUri = metadata.uri ? metadata.uri.replaceAll("\u0000", "") : null
    const symbol = metadata.symbol ? metadata.symbol.replaceAll("\u0000", "") : ""

    let data = {
      image: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${token.mint}/logo.png`
    }
    if (metadataUri) {
      console.log("Getting token metadata", metadataUri)
      const r = await axios.get(metadataUri)
      data = r.data
    }

    return {
      metadata: metadata,
      name: tokenName,
      metadataUri: metadataUri,
      symbol: symbol,
      usdPrice: usdPrice,
      amount: token.amount.uiAmount,
      data: data
    }
  }

  /**
   * Accessor to rpc client
   *
   * @returns {*}
   */
  rpc() {
    return this.getManager(SOLANA_MANAGER).rpc()
  }

  async getHtml() {
    this.setTitle("Token Show");

    console.log("Showing Token", this._data)

    const token = await this.getManager(TOKEN_MGR).getToken(this._data.mint)
    console.log("Token: ", token)

    const detail = await this.getTokenDetail(token.liquid)

    const history = await this.rpc().getSignaturesForAddress(token.liquid.publicKey, {
      limit: 5,
    })
    console.log("history", history)

    let histView = ``

    for (let i = 0; i < history.length; i++) {
      histView += await this.addSubView(TransactionCard, {
        txn: history[i],
        tokenPrice: this._data.price,
        decimals: token.liquid.amount.decimals
      }).getHtml()
    }

    return `<div class="row">
	<div class="col-3 p-2">
		${detail ? '<img class="img-fluid" alt="" src="' + detail.data.image + '">' : ''}
	</div>
	<div class="col-7 text-start">
		<h1>${detail.amount.toLocaleString("en-US", {maximumFractionDigits: 3})} ${detail.symbol}</h1>
		<h3>${detail.usdPrice}</h3>
	</div>
	<div class="col-2 p-2">
		<div class="mt-1"><a target="_blank" href="https://solscan.io/token/${token.liquid.publicKey}"><img style="width: 20px" src="https://solscan.io/favicon.ico"
				class="img-fluid" alt="solscan"></a></div>
		<div class="mt-1"><a target="_blank" href="https://solana.fm/address/${token.liquid.publicKey}"><img style="width: 20px" src="https://solana.fm/favicon.ico"
				class="img-fluid" alt="solanaFM"></a></div>
		<div class="mt-1"><a target="_blank" href="https://explorer.solana.com/address/${token.liquid.publicKey}"><img style="width: 20px"
				src="https://explorer.solana.com/favicon.ico" class="img-fluid" alt="solana explorer"></a></div>
	</div>
</div>
<div class="row mt-3 mb-3">
	<div class="col-6">
		<button data-link="transfer/deposit" class="btn btn-primary btn-block">Deposit</button>
	</div>
	<div class="col-6">
		<button data-link="transfer/send" class="btn btn-primary btn-block">Send</button>
	</div>
</div>
<h6>${this._data.mint}</h6>
<div class="row p-2">${histView}</div>`;
  }
}
