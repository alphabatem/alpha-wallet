import AbstractView from "../../view.js";
import axios from "axios";

export class TokenCard extends AbstractView {
  // _data = {token: {}, price: 0}

  async getHtml() {
    const usdPrice = (this._data.token.amount.uiAmount * (this._data.price || 0)).toLocaleString("en-US", {
      style: 'currency',
      currency: "USD"
    })

    const metadata = this._data.token.meta ? this._data.token.meta.data : {}
    const tokenName = metadata.name ? metadata.name.replaceAll("\u0000", "") : this._data.token.mint.substring(0, 16)
    const metadataUri = metadata.uri ? metadata.uri.replaceAll("\u0000", "") : null
    const symbol = metadata.symbol ? metadata.symbol.replaceAll("\u0000", "") : ""

    let data = {
      image: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${this._data.token.mint}/logo.png`
    }
    if (metadataUri) {
      console.debug("Getting token metadata", metadataUri)
      const r = await axios.get(metadataUri).catch(e => {
      })
      if (r)
        data = r.data
    }

    return `<div class="card token-card" data-mint="${this._data.token.mint}">
	<div class="card-body token-card-body">
		<table class="table">
			<tbody>
			<tr class="text-start">
				${data ? '<td style="width: 50px"><img class="token-img" alt="" src="' + data.image + '"></td>' : ''}
				<td class="text-start">
					<h5>${tokenName}</h5>
					<h6>${this._data.token.amount.uiAmount} ${symbol}</h6></td>
				<td class="text-end">
					<h4> ${usdPrice}</h4></td>
			</tr>
			</tbody>
		</table>
	</div>
</div>`
  }
}
