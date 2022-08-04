import {Manager} from "../manager";
import {SOLANA_MANAGER} from "../solana/solanaManager";
import {web3} from "@project-serum/anchor";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";

export class TokenManager extends Manager {

  _tokens = {
    staked: {}, //TODO
    liquid: {},
  }

  tokenMetadata = {}

  solBalance = 0

  TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

  id() {
    return TOKEN_MGR
  }

  /**
   * Returns the wallets SOL balance
   *
   * @returns {Promise<void>}
   */
  async getBalance() {
    const walletAddr = await this.store.getWalletAddr()
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

  async getTokens() {
    await this.getLiquidTokens()
    await this.getStakedTokens()

    return this._tokens
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
  async getLiquidTokens() {
    const walletAddr = await this.store.getWalletAddr()

    const accounts = await this.rpc().getParsedTokenAccountsByOwner(
      new web3.PublicKey(walletAddr),
      {
        programId: new web3.PublicKey(this.TOKEN_PROGRAM),
      }
    )

    console.log("Accounts", accounts)
    const metadataAccs = {}

    for (const a of accounts.value) {
      const acc = a.account.data.parsed

      if (acc.info.tokenAmount.decimals === 0 || acc.info.tokenAmount.uiAmount === 0)
        continue //NFT

      const meta = await this.getTokenMetadata(acc.info.mint)

      this._tokens.liquid[acc.info.mint] = {
        mint: acc.info.mint,
        owner: acc.info.owner,
        amount: acc.info.tokenAmount,
        meta: meta
      }
    }

    return this._tokens.liquid
  }

  /**
   *
   * @param tokenMint<web3.PublicKey>
   * @returns {Promise<void>}
   */
  async getMetadataPDA(tokenMint) {
    return (
      await web3.PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          this.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          tokenMint.toBuffer(),
        ],
        this.TOKEN_METADATA_PROGRAM_ID,
      )
    )[0]
  }

  async getTokenMetadata(tokenMint) {
    if (this.tokenMetadata[tokenMint])
      return this.tokenMetadata[tokenMint]

    const pda = await this.getMetadataPDA(new web3.PublicKey(tokenMint))
    const data = await this.rpc().getAccountInfo(pda, "finalized")
    if (!data)
      return null

    const metadata = Metadata.deserialize(data.data)
    if (!metadata)
      return null

    this.tokenMetadata[tokenMint] = metadata[0]



    return this.tokenMetadata[tokenMint]
  }

  //TODO complete
  async getStakedTokens() {
    //
  }

}

export const TOKEN_MGR = "token_manager"
