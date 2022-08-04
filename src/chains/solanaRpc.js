import {web3} from "@project-serum/anchor";
import axios from "axios";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";


export class SolanaRPC {

  connection = null

  constructor(endpoint, commitment) {
    this._startConnection(endpoint, commitment)
  }


  _startConnection(endpoint = "https://ssc-dao.genesysgo.net/", commitment = "finalized") {
    this.connection = new web3.Connection(endpoint, commitment)
  }


  getBalance(tokenAddr) {
    return this.connection.getBalance(new web3.PublicKey(tokenAddr), "finalized")
  }

  getTokenInfo(tokenAddr) {
    return this.connection.getParsedAccountInfo(new web3.PublicKey(tokenAddr))
  }

  async getTokenOwner(tokenAddr) {
    const largestAccounts = await this.connection.getTokenLargestAccounts(new web3.PublicKey(tokenAddr));
    const largestAccountInfo = await this.connection.getParsedAccountInfo(largestAccounts.value[0].address);

    return largestAccountInfo.value.data.parsed.info.owner
  }

  getMetadataFile(file) {
    return axios.get(file)
  }

  async getMetadata(acc) { //mint Address : String (Public Key)
    // console.log("Getting metadata", acc)
    const tokenmetaPubkey = await Metadata.getPDA(new web3.PublicKey(acc)); //Promise -> PublicKey (0x1231233434)


    // console.log("TokenMetaPubkey", tokenmetaPubkey.toString())
    return Metadata.load(this.connection, tokenmetaPubkey); // Promise -> Object(Metadata)
  }

  getTokenMint(tokenAccountAddr, cb) {
    this.connection.getParsedAccountInfo(new web3.PublicKey(tokenAccountAddr)).then((resp) => {
      cb(resp.value.data.parsed.info.mint)
    })
  }

  getAllMetadata(tokens) {
    // console.log("Getting all metadata", tokens)
    return this.connection.getMultipleAccountsInfo(tokens, "finalized")
  }
}
