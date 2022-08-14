import {AbstractManager} from "../abstractManager";
import {NS_MANAGER} from "../core/namespaceManager";
import * as bip39 from "bip39";
import * as bs58 from "bs58";
import {Keypair} from "@solana/web3.js";
import {derivePath} from "ed25519-hd-key";

export class WalletManager extends AbstractManager {

  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return WALLET_MGR
  }

  /**
   * Get next keypair from given mnemonic
   *
   * @param mnemonic
   * @param password
   * @param i
   * @returns {Keypair | nacl.SignKeyPair}
   */
  getNextKeyPair(mnemonic, password, i = 0) {
    const seed = bip39.mnemonicToSeedSync(mnemonic, password);
    const path = `m/44'/501'/${i}'/0'`;
    return Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    )
  }

  /**
   * Import a private key
   *
   * @param name
   * @param secret
   * @param pk
   * @returns {Promise<void>}
   */
  async importWallet(name, secret, pk) {
    const keyPair = this.decodeKeypair(secret)
    await this._storeKeypair(keyPair, pk)
    await this._updateNamespace(name, keyPair.publicKey)
  }

  /**
   * Decodes a secret into keypair
   * @param secret
   * @returns {*}
   */
  decodeKeypair(secret) {
    return Keypair.fromSecretKey(bs58.decode(secret));
  }

  decodePrivateKey(pk) {
    return bs58.decode(pk)
  }

  /**
   * Add a new wallet with existing mnemonic as seed
   *
   * @param name
   * @param pk User passcode
   * @returns {Promise<void>}
   */
  async addWallet(name, pk) {
    const store = await this.getKeyStore()
    const mnemonic = await store.getMnemonic(pk)

    const i = await store.keysInUse()
    const keyPair = this.getNextKeyPair(mnemonic, pk, i)

    await this._storeKeypair(keyPair, pk)
    await this._updateNamespace(name, keyPair.publicKey)
    await store.incrementKeysUsed()
  }

  /**
   * Create a new wallet with given mnemonic phrase
   *
   * @param name
   * @param mnemonic
   * @param pk Users passcode
   * @returns {Promise<void>}
   */
  async createNewWallet(name, mnemonic, pk) {
    const store = await this.getKeyStore()

    const ok = await store.setMnemonic(this._mnemonic, pk)
    if (!ok) {
      console.error("unable to add mnemonic")
      return
    }

    const keyPair = this.getNextKeyPair(mnemonic, pk)
    await this._storeKeypair(keyPair, pk)
    await this._updateNamespace(name, keyPair.publicKey)
    await store.incrementKeysUsed()
  }


  /**
   * Store the keypair down into keyStore
   *
   * @param keypair
   * @param pk
   * @returns {Promise<void>}
   * @private
   */
  async _storeKeypair(keypair, pk) {
    const store = await this.getKeyStore()
    const ok = await store.setPrivateKey(keypair.publicKey.toString(), bs58.encode(keypair.secretKey), pk)
    if (!ok) {
      console.error("unable to add private key")
      return
    }
  }

  /**
   * Create the namespace for a given publicKey
   *
   * @param name
   * @param publicKey
   * @returns {Promise<void>}
   * @private
   */
  async _updateNamespace(name, publicKey) {
    console.log("Adding to NS list", publicKey.toString(), name)
    const nsMgr = this.getManager(NS_MANAGER)
    await nsMgr.addNamespace(publicKey.toString(), name)
    await nsMgr.setActiveNamespace(publicKey.toString())
    await this.getStore().setWalletAddr(publicKey.toString())
    await this.getStore().setWalletName(name)
  }


  getKeyStore() {
    return this.getStorageManager().getKeyStore()
  }
}

export const WALLET_MGR = "wallet_mgr"
