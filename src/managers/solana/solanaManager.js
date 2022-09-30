import {AbstractManager} from "../abstractManager";
import {SolanaRPC} from "../../chains/solanaRpc";
import {EVENT_MGR, EVENTS} from "../core/eventManager";
import {MESSAGE_MGR} from "../browser_messages/messageManager";
import nacl from "tweetnacl";
import {decodeUTF8, encodeUTF8} from "tweetnacl-util";
import {SolanaTransactionManager} from "./solanaTransactionManager";
import {web3} from "@project-serum/anchor";
import {NS_MANAGER} from "../core/namespaceManager";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress
} from "@solana/spl-token";

export class SolanaManager extends AbstractManager {

  _rpc

  txnManager

  configure(ctx) {
    super.configure(ctx);
    this.getManager(EVENT_MGR).subscribe(EVENTS.onConfig, (c) => this._onConfig(c))
    const ok = this.getManager(MESSAGE_MGR).registerHandler("solana", this)
    if (!ok)
      throw new Error("unable to register solana manager")
  }


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return SOLANA_MANAGER
  }

  rpc() {
    return this._rpc
  }

  _onConfig(cfg) {
    console.log("Config loaded, starting RPC", cfg.rpcUrl)
    this._rpc = new SolanaRPC(cfg.rpcUrl, cfg.commitment)
    this.txnManager = new SolanaTransactionManager(this._rpc)
  }

  getTransactionManager() {
    return this.txnManager
  }

  /**
   * Handle incoming requests
   *
   * @param r
   * @returns {Promise<void>}
   */
  async request(r = {method: "", data: {}}) {
    if (!r.data)
      r.data = {};

    switch (r.method) {
      case "signAndSendTransaction":
        return this._signAndSendTransaction(r.data)
      case "signTransaction":
        return this._signTransaction(r.data)
      case "signAllTransactions":
        return this._signAllTransactions(r.data)
      case "signMessage":
        return this.signMessage(r.data)
    }

    throw new Error("invalid method")
  }


  /**
   * signAndSendTransaction signs & then sends the payload via the wallet RPC
   *
   * @param data
   */
  async _signAndSendTransaction(data, keypair) {

  }

  /**
   * signTransaction and return the signed payload
   *
   * @param data
   */
  async _signTransaction(data, keypair) {
  }

  /**
   * signAllTransactions and return the signed payload
   *
   * @param data
   */
  async _signAllTransactions(data, keypair) {
  }

  /**
   * signMessage and return signed response
   *
   * @param data
   * @param keyPair
   */
  async signMessage(data, keyPair) {
    console.log("Signing Message", data)
    const message = data.message
    const messageBytes = decodeUTF8(message)
    const signature = nacl.sign.detached(messageBytes, keyPair.secretKey)
    const signatureArray = []
    const keys = Object.keys(signature)

    for (let i = 0; i < keys.length; i++) {
      signatureArray.push(signature[keys[i]])
    }

    return Uint8Array.from(signatureArray)
  }

  async sendNFTTokens(tokens, recipientAddr) {
    const tx = new web3.Transaction()

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const t = await this.sendToken(token, 1, recipientAddr)
      tx.add(t)
    }

    return tx
  }


  async signAndSendTransaction(data, keyPair) {
    return await web3.sendAndConfirmTransaction(this.rpc().connection, data, [keyPair]);
  }

  /**
   * Send SPL tokens to a recipientAddress
   * @param mintAddr
   * @param amount
   * @param recipientAddr
   * @returns {Promise<module:"@solana/web3.js".Transaction>}
   */
  async sendToken(mintAddr, amount, recipientAddr) {
    console.log(`Sending ${mintAddr} - QTY: ${amount} -> ${recipientAddr}`)

    const walletAddr = this.getManager(NS_MANAGER).getActiveNamespace().key
    const mint = new web3.PublicKey(mintAddr)


    let tx = new web3.Transaction()

    const originAccount = await getAssociatedTokenAddress(mint, new web3.PublicKey(walletAddr))
    const recipientAccount = await getAssociatedTokenAddress(mint, new web3.PublicKey(recipientAddr))

    tx.add(
      createAssociatedTokenAccountInstruction(
        new web3.PublicKey(walletAddr), // payer
        recipientAccount, // ata
        new web3.PublicKey(recipientAddr), // owner
        mint // mint
      )
    );

    tx.add(createTransferCheckedInstruction(
      originAccount, // from (should be a token account)
      mint, // mint
      recipientAccount, // to (should be a token account)
      new web3.PublicKey(recipientAddr), // from's owner
      amount, // amount, if your deciamls is 8, send 10^8 for 1 token
      8 // decimals
    ))

    return tx
  }


  async sendSOL() {

    //TODO
  }


  async stakeSOL() {

    //TODO
  }

}

export const SOLANA_MANAGER = "solana_mgr"
