import {AbstractManager} from "../abstractManager";
import {SOLANA_MANAGER} from "../solana/solanaManager";
import {web3} from "@project-serum/anchor";
import {PRICE_MANAGER} from "../pricing/priceManager";

export class TokenManager extends AbstractManager {

  _tokens = {
    staked: {}, //TODO
    liquid: {},
  }

  tokenMetadata = {}

  solBalance = 0


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return TOKEN_MGR
  }

  /**
   * Returns the wallets SOL balance
   *
   * @returns {Promise<void>}
   */
  async getBalance() {
    const walletAddr = await this.getStore().getWalletAddr()
    this.solBalance = await this.getManager(SOLANA_MANAGER).rpc().getBalance(walletAddr)
    console.log("Sol Balance", this.solBalance)
  }

  /**
   * Returns the balance for a given token addr
   *
   * @param tokenAddr
   * @returns {Promise<*>}
   */
  async getTokenBalance(tokenAddr) {
    const balance = await this.getManager(SOLANA_MANAGER).rpc()
    console.log("Token balance", balance)

    return balance
  }

  /**
   * Returns the balance for a given token addr
   *
   * @param tokenAddr
   * @returns {Promise<*>}
   */
  async getSOLBalance(walletAddr) {
    const balance = await this.getManager(SOLANA_MANAGER).rpc().getBalance(walletAddr)
    console.log("Token SOL", balance)

    return balance
  }

  async getTokens() {
    const walletAddr = await this.getStore().getWalletAddr()

    await this.getLiquidTokens(walletAddr)
    await this.getStakedTokens(walletAddr)


    const solToken = await this.getSOLBalance(walletAddr)
    console.log("SOLToken", solToken)

    this._tokens.liquid["11111111111111111111111111111111"] = {
      amount: {
        amount: solToken,
        decimals: 9,
        uiAmount: solToken / Math.pow(10, 9),
        uiAmountString: `${solToken / Math.pow(10, 9)}`
      },
      meta: {
        data: {
          name: "Solana (Native)",
          symbol: "SOL",
          image: "/images/solana.png"
        }
      },
      mint: "11111111111111111111111111111111",
      owner: walletAddr,
      publicKey: walletAddr
    }

    return this._tokens
  }

  async getToken(tokenAddr) {
    const price = await this.getManager(PRICE_MANAGER).getPrice(tokenAddr)
    const meta = await this.getTokenMetadata(tokenAddr)
    return {
      liquid: this._tokens.liquid[tokenAddr] ? this._tokens.liquid[tokenAddr] : {},
      staked: this._tokens.staked[tokenAddr] ? this._tokens.staked[tokenAddr] : {},
      meta: meta,
      price: price
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

  /**
   * Get the wallets token accounts
   *
   * TODO PERF:Check users owning large amounts of token accounts
   * TODO Add native sol
   *
   * @returns {Promise<void>}
   */
  async getLiquidTokens(walletAddr) {
    if (!walletAddr || walletAddr === "_default")
      return {}

    console.log("WalletAddr", walletAddr)
    const accounts = await this.rpc().getParsedTokenAccountsByOwner(new web3.PublicKey(walletAddr))

    for (const a of accounts.value) {
      const acc = a.account.data.parsed

      if (acc.info.tokenAmount.decimals === 0 || acc.info.tokenAmount.uiAmount === 0)
        continue //NFT

      const meta = await this.getTokenMetadata(acc.info.mint)

      this._tokens.liquid[acc.info.mint] = {
        publicKey: a.pubkey.toString(),
        mint: acc.info.mint,
        owner: acc.info.owner,
        amount: acc.info.tokenAmount,
        meta: meta
      }
    }

    return this._tokens.liquid
  }

  async getTokenMetadata(tokenMint) {
    if (this.tokenMetadata[tokenMint])
      return this.tokenMetadata[tokenMint]

    this.tokenMetadata[tokenMint] = this.rpc().getTokenMetadata(tokenMint)
    return this.tokenMetadata[tokenMint]
  }

  //TODO complete
  async getStakedTokens(walletAddr) {
    //
  }

}

export const TOKEN_MGR = "token_manager"
