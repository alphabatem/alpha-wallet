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




  validHosts = {
    "ipfs.io": true,
    "arweave.net": true,
    "nftstorage.link": true,
    "shdw-drive.genesysgo.net": true,
    "testlaunchmynft.mypinata.cloud": true,
  }

  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return NFT_MGR
  }

  getMetadataFile(file) {
    return axios.get(file)
  }


  async getNFTs() {
    const walletAddr = await this.getStore().getWalletAddr()

    if (!walletAddr || walletAddr === "_default")
      return this._nfts

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

      this._nfts.liquid[acc.info.mint] = {
        mint: acc.info.mint,
        owner: acc.info.owner,
        amount: acc.info.tokenAmount,
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


  /**
   * Check basic params to see if scam
   *
   * @param nft
   * @param metadata
   * @returns {boolean}
   */
  isScam(nft, metadata) {
    if (!nft.data || !nft.data.creators)
      return true

    if (!metadata.attributes)
      return true

    if (nft.data.sellerFeeBasisPoints !== metadata.seller_fee_basis_points)
      return true

    return false
  }

  isTokenSuspect(nft) {
    const nftUri = new URL(nft.data.uri.replaceAll("\u0000", ""))
    if (!this.validHosts[nftUri.host])
      return true

      return false
  }

  /**
   * Returns if the URLs in the file look sus
   * @param metadata
   * @returns {boolean}
   */
  isMetadataSuspect(metadata) {
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

  /**
   * Returns if a provided NFT & metadata is verified correctly
   *
   * @param nft
   * @param metadata
   * @returns {boolean}
   */
  isVerified(nft, metadata) {
    if (!nft.data || !nft.data.creators)
      return false

    if (!nft.data.creators[0].verified)
      return false

    return false
  }
}

export const NFT_MGR = "nft_manager"
