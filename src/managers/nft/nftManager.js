import {AbstractManager} from "../abstractManager";
import axios from "axios";
import {web3} from "@project-serum/anchor";
import {SOLANA_MANAGER} from "../solana/solanaManager";

export class NFTManager extends AbstractManager {


  _nfts = {
    staked: {},
    listed: {},
    liquid: {},
  }

  tokenMetadata = {}

  TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  TOKEN_PROGRAM = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

  id() {
    return NFT_MGR
  }

  getMetadataFile(file) {
    return axios.get(file)
  }

  getLiquid() {

  }


  async getNFTs() {
    const walletAddr = await this.getStore.getWalletAddr()

    await this.getLiquidNFTs(walletAddr)
    await this.getListedNFTs(walletAddr)
    await this.getStakedNFTs(walletAddr)

    return this._nfts
  }

  /**
   * Queries for the wallets Liquid NFTs
   */
  async getLiquidNFTs(walletAddr) {
    const accounts = await this.rpc().getParsedTokenAccountsByOwner(new web3.PublicKey(walletAddr))

    for (const a of accounts.value) {
      const acc = a.account.data.parsed

      if (acc.info.tokenAmount.uiAmount !== 1)
        continue //Token

      const meta = await this.getTokenMetadata(acc.info.mint).catch((e) => {})
      if (!meta)
        continue

      this._nfts.liquid[acc.info.mint] = {
        mint: acc.info.mint,
        owner: acc.info.owner,
        amount: acc.info.tokenAmount,
        meta: meta
      }
    }

    return this._nfts.liquid
  }

  /**
   * Queries for the wallets Listed NFTs
   */
  async getListedNFTs(walletAddr) {

  }

  /**
   * Queries for the wallets Staked NFTs
   */
  async getStakedNFTs(walletAddr) {

  }



  async getTokenMetadata(tokenMint) {
    if (this.tokenMetadata[tokenMint])
      return this.tokenMetadata[tokenMint]

    this.tokenMetadata[tokenMint] = this.rpc().getTokenMetadata(tokenMint)
    return this.tokenMetadata[tokenMint]
  }

  /**
   * Accessor to rpc client
   *
   * @returns {*}
   */
  rpc() {
    return this.getManager(SOLANA_MANAGER).rpc()
  }
}

export const NFT_MGR = "nft_manager"
