import {web3} from "@project-serum/anchor";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";


export class SolanaRPC {

  connection = null

  TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  TOKEN_PROGRAM = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

  constructor(endpoint, commitment) {
    this._startConnection(endpoint, commitment)
  }


  _startConnection(endpoint = "ssc-dao.genesysgo.net/", commitment = "finalized") {
    if (endpoint.indexOf("://") === -1)
      endpoint = `https://${endpoint}`

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

  getParsedAccountInfo(tokenAccountAddr, commitment = "finalized") {
    return this.connection.getParsedAccountInfo(tokenAccountAddr, commitment)
  }

  getAccountInfo(tokenAccountAddr, commitment = "finalized") {
    return this.connection.getAccountInfo(tokenAccountAddr, commitment)
  }

  getParsedTokenAccountsByOwner(tokenAccountAddr, filter = {
    programId: this.TOKEN_PROGRAM,
  }) {
    return this.connection.getParsedTokenAccountsByOwner(tokenAccountAddr, filter)
  }

  /**
   * Returns mutliple account info data
   * @param tokens
   * @param commitment
   * @returns {*}
   */
  getMultipleAccountsInfo(tokens, commitment = "finalized") {
    return this.connection.getMultipleAccountsInfo(tokens, commitment)
  }


  /**
   * Returns the associated metadata for a given mint
   *
   * @param tokenMint
   * @returns {Promise<Metadata|null>}
   */
  async getTokenMetadata(tokenMint) {
    const pda = await this.getMetadataPDA(new web3.PublicKey(tokenMint))
    const data = await this.connection.getAccountInfo(pda, "finalized")
    if (!data)
      return null

    const metadata = Metadata.deserialize(data.data)
    if (!metadata)
      return null

    return metadata[0]
  }


  /**
   * Returns the txn signatures for a given address
   *
   * @param tokenAddr
   * @param opts
   * @returns {Promise<*|Array<ConfirmedSignatureInfo>>}
   */
  async getSignaturesForAddress(tokenAddr, opts) {
    return this.connection.getSignaturesForAddress(new web3.PublicKey(tokenAddr), opts)
  }

  async getTransaction(signature, opts) {
    return this.connection.getTransaction(signature, opts)
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
}
