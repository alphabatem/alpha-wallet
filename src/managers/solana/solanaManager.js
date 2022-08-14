import {AbstractManager} from "../abstractManager";
import {SolanaRPC} from "../../chains/solanaRpc";
import {EVENT_MGR, EVENTS} from "../core/eventManager";
import {MESSAGE_MGR} from "../browser_messages/messageManager";
import nacl from "tweetnacl";
import {decodeUTF8} from "tweetnacl-util";
import {SolanaTransactionManager} from "./solanaTransactionManager";

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
        return this._signMessage(r.data)
    }

    throw new Error("invalid method")
  }


  /**
   * signAndSendTransaction signs & then sends the payload via the wallet RPC
   *
   * @param data
   */
  async _signAndSendTransaction(data) {

  }

  /**
   * signTransaction and return the signed payload
   *
   * @param data
   */
  async _signTransaction(data) {
  }

  /**
   * signAllTransactions and return the signed payload
   *
   * @param data
   */
  async _signAllTransactions(data) {
  }

  /**
   * signMessage and return signed response
   *
   * @param data
   */
  async _signMessage(data) {
    //TODO Get keypair

    const ns = this.getStore().getActiveNamespace()
    const ks = this.getStore().getKeyStore()
    if (!ks || ks.isLocked())
      return null

    const keypair = ks.getPrivateKey(ns) //TODO this is base58 encoded
    // responsible for key

    //TODO Get message
    const message = data.message

    //TODO Decode to bytes
    const messageBytes = decodeUTF8(message)

    const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
    const result = nacl.sign.detached.verify(
      messageBytes,
      signature,
      keypair.publicKey.toBytes()
    );

    console.log(result);
    return signature
  }


}

export const SOLANA_MANAGER = "solana_mgr"
