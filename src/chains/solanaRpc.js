import {web3} from "@project-serum/anchor";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";


export class SolanaRPC {

  connection = null

  constructor(endpoint, commitment) {
    this._startConnection(endpoint, commitment)
  }


  _startConnection(endpoint = "https://ssc-dao.genesysgo.net/", commitment = "finalized") {
    this.connection = new web3.Connection(endpoint, commitment)
    console.log("Connected to", endpoint)
  }


  getBalance(tokenAddr, commitment = "finalized") {
    return this.connection.getBalance(new web3.PublicKey(tokenAddr), commitment)
  }

  /**
   * Returns the owner of a given token account
   *
   * @param tokenAddr
   * @returns {Promise<*>}
   */
  async getTokenOwner(tokenAddr) {
    const largestAccounts = await this.connection.getTokenLargestAccounts(new web3.PublicKey(tokenAddr));
    const largestAccountInfo = await this.connection.getParsedAccountInfo(new web3.PublicKey(largestAccounts.value[0].address));

    return largestAccountInfo.value.data.parsed.info.owner
  }

  /**
   * Returns the metadata for a given account
   *
   * @param acc
   * @returns {Promise<*>}
   */
  async getMetadata(acc) {
    const tokenmetaPubkey = await Metadata.getPDA(new web3.PublicKey(acc));
    return Metadata.load(this.connection, tokenmetaPubkey);
  }

  getParsedAccountInfo(tokenAccountAddr, commitment = "finalized") {
    return this.connection.getParsedAccountInfo(tokenAccountAddr, commitment)
  }

  getAccountInfo(tokenAccountAddr, commitment = "finalized") {
    return this.connection.getAccountInfo(tokenAccountAddr, commitment)
  }

  getParsedTokenAccountsByOwner(tokenAccountAddr, filter) {
    return this.connection.getParsedTokenAccountsByOwner(tokenAccountAddr, filter)
  }

  getMultipleAccountsInfo(tokens, commitment = "finalized") {
    return this.connection.getMultipleAccountsInfo(tokens, commitment)
  }
}
