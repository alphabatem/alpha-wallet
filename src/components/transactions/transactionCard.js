import AbstractView from "../../view";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";

export class TransactionCard extends AbstractView {

  txnDetail = null

  constructor(router, wallet, data = {}) {
    super(router, wallet, data);
  }

  async getHtml() {
    const txn = this._data.txn
    const txnTime = new Date(txn.blockTime * 1000).toLocaleString()

    this.txnDetail = await this.getManager(SOLANA_MANAGER).rpc().getTransaction(this._data.txn.signature).catch((e) => this.txnDetail = {})
    const profit = this.calculateTradeProfit(await this.getWalletAddr(), this.txnDetail)

    return `<div class="col-12"><a style="text-decoration: none; color: white" target="_blank" href="https://solscan.io/tx/${this._data.txn.signature}"><div class="card txn-card">
	<div class="card-body p-2">
		<div class="text-start col-row">
		<div class="col-3">${txn.err ? '<span' +
      ' class="text-danger small">ERROR</span>' : '<span' +
      ' class="text-success small">SUCCESS</span>'}</div>
			<div class="col-5">
				<h6>${txnTime}</h6>
			</div>
			<div class="col-4 text-end">${profit.toLocaleString("en-US", {
      style: 'currency',
      currency: "USD",
      maximumFractionDigits: 3})}</div>
		</div>
	</div>
	</div></a>
</div>`
  }




  calculateTradeProfit(tokenAddr, txn) {
    const trades = this.calculateProfit(tokenAddr, txn)
    let totalProfit = 0;
    for (let i = 0; i < trades.length;i++){
      if (trades[i].mint === '') {
        continue //No profit
      }
      if (this._data.tokenPrice) {
        const tokenPrice = this._data.tokenPrice
        const profit = (trades[i].diff / Math.pow(10, this._data.decimals)) * tokenPrice;
        totalProfit += profit
      }
    }

    return totalProfit;
  }



  calculateProfit(tokenAddr, txn) {
    const mintDiff = {};
    const mintIdx = {};

    const signer = txn.transaction.message.accountKeys[0]
    // console.debug("Calculating profit", txn.signature, tokenAddr, signer, txn)
    for (let i = 0; i < txn.meta.postTokenBalances.length; i++) {
      if (txn.meta.postTokenBalances[i].owner !== signer)
        continue

      const b = txn.meta.postTokenBalances[i]
      mintDiff[b.mint] = parseInt(b.uiTokenAmount.amount)
      mintIdx[b.mint] = b
    }

    for (let i = 0; i < txn.meta.preTokenBalances.length; i++) {
      if (txn.meta.preTokenBalances[i].owner !== signer)
        continue

      const b = txn.meta.preTokenBalances[i]
      mintIdx[b.mint] = b

      if (!mintDiff[b.mint]) {
        mintDiff[b.mint] = 0 //Post balance was not found so assume account closed
      }

      mintDiff[b.mint] -= parseInt(b.uiTokenAmount.amount)
    }


    const keys = Object.keys(mintDiff)
    for (let i = 0; i < keys.length; i++) {
      if (mintDiff[keys] === 0)
        delete mintDiff[keys]
    }


    let ownerIdx = -1;
    for (let i = 0; i < txn.transaction.message.accountKeys.length; i++) {
      if (signer === txn.transaction.message.accountKeys[i]) {
        ownerIdx = i;
        break
      }
    }

    if (ownerIdx > -1) {
      const preSol = txn.meta.preBalances[ownerIdx]
      const postSol = txn.meta.postBalances[ownerIdx]
      const diff = postSol - preSol
      if (diff !== -txn.meta.fee) {
        mintDiff["11111111111111111111111111111111"] = diff
        mintIdx["11111111111111111111111111111111"] = {
          Owner: signer,
          Mint: "11111111111111111111111111111111",
        }
      }
    }

    if (Object.keys(mintDiff).length === 0) {
      console.debug("No profit", txn.signature, signer)
      const t = {
        ...txn,
        ...{
          err: true,
          token: '',
          mint: '',
          diff: 0,
          gas: txn.meta.fee,
        }
      }
      return [t]
    }


    let trades = [];
    const ok = Object.keys(mintDiff)
    for (let i = 0; i < ok.length; i++) {
      const mint = ok[i]
      const diff = mintDiff[mint]

      const t = {
        ...txn,
        ...{
          token: mint,
          mint: mint,
          diff: parseFloat(diff),
          meta: {fee: i === 0 ? txn.meta.fee : 0}
        }
      }
      trades.push(t);
    }

    return trades.reverse();
  }
}
