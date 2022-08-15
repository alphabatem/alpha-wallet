import {AbstractManager} from "../abstractManager";
import {SolanaRPC} from "../../chains/solanaRpc";
import {EVENT_MGR, EVENTS} from "../core/eventManager";
import {MESSAGE_MGR} from "../browser_messages/messageManager";
import nacl from "tweetnacl";
import {decodeUTF8} from "tweetnacl-util";
import {SolanaTransactionManager} from "./solanaTransactionManager";
import {web3} from "@project-serum/anchor";
import {NS_MANAGER} from "../core/namespaceManager";
import {Keypair} from "@solana/web3.js";
import * as bs58 from "bs58";
import {WALLET_MGR} from "../wallets/walletManager";

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
    const message = data.message
    const messageBytes = decodeUTF8(message)
    return nacl.sign.detached(messageBytes, keyPair.secretKey)
  }

  async sendToken() {

    //TODO
  }


  /**
   * Send SPL tokens to a recipientAddress
   * @param mintAddr
   * @param amount
   * @param recipientAddr
   * @returns {Promise<void>}
   */
  async sendTokens(mintAddr, amount, recipientAddr) {
    const walletAddr = this.getManager(NS_MANAGER).getActiveNamespace().key
    const mint = web3.PublicKey(mintAddr)

    // Get the token account of the fromWallet Solana address, if it does not exist, create it
    const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(walletAddr);

    //get the token account of the toWallet Solana address, if it does not exist, create it
    const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(recipientAddr);

    const transaction = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        amount
      )
    );

// Sign transaction, broadcast, and confirm
    await web3.sendAndConfirmTransaction(this.rpc(), transaction, [fromWallet]);
  }


  async sendSOL() {

    //TODO
  }


  async stakeSOL() {

    //TODO
  }

}

export const SOLANA_MANAGER = "solana_mgr"
