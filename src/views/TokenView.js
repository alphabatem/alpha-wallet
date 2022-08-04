import AbstractView from "../view.js";
import {TOKEN_MGR} from "../managers/tokens/tokenManager";
import {TokenCard} from "../components/tokens/TokenCard";
import {PRICE_MANAGER} from "../managers/pricing/priceManager";

export default class TokenView extends AbstractView {
  constructor(router, wallet) {
    super(router, wallet);
    this.setTitle("Tokens");
  }

  async onMounted(app) {
    super.onMounted(app)
  }


  async getHtml() {
    const walletName = await this.getWallet().getStore().getPlain("wallet_name").catch(e => {
    })

    const tokenPrices = await this.getManager(PRICE_MANAGER).getPrices()
    console.log("tokenPrices", tokenPrices)

    const mgr = this.getManager(TOKEN_MGR)
    const tokens = await mgr.getTokens()
    console.log("Tokens", tokens)

    let totalPrice = 0
    let tokenViews = ""

    const sorted = Object.values(tokens.liquid).sort((a,b) => {
      return (b.amount.uiAmount * (tokenPrices[b.mint] || 0)) - (a.amount.uiAmount * (tokenPrices[a.mint] || 0))
    })

    console.log("Sorted", sorted)

    for (let i = 0; i < sorted.length; i++) {
      totalPrice += (sorted[i].amount.uiAmount * (tokenPrices[sorted[i].mint] || 0))
      tokenViews += await this.addSubView(TokenCard, {
        token: sorted[i],
        price: tokenPrices[sorted[i].mint]
      }).getHtml()
    }

    let h = `
    <h5 class="text-start mb-3">Welcome Back, ${walletName}!</h5>

    <h1 class="mb-3">${totalPrice.toLocaleString("en-US", {
      style: 'currency',
      currency: "USD"
    })}</h1>

    <div class="row mt-3 mb-3">
      <div class="col-6">
        <button data-link="transfer/deposit" class="btn btn-primary btn-block">Deposit</button>
      </div>
      <div class="col-6">
        <button data-link="transfer/send" class="btn btn-primary btn-block">Send</button>
      </div>
    </div>`


    if (tokens.liquid.length === 0)
      h += `
    <div class="token-container">
      <i class="small">No Token Assets Detected</i>
    </div>`
    else {
      h += tokenViews
    }


    return h;
  }
}
