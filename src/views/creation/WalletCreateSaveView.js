import AbstractView from "../../view.js";
import * as bip39 from "bip39";
import {Keypair} from "@solana/web3.js";
import {derivePath} from "ed25519-hd-key";
import {NS_MANAGER} from "../../managers/core/namespaceManager";

export default class WalletCreateSaveView extends AbstractView {
  nameInput
  inp
  elems
  error

  _mnemonic = '';

  async createWallet(e) {
    if (!this.validateInputs()) {
      this.clearInputs()
      this.error.innerHTML = "Invalid inputs, try again."
      return
    }

    console.log("Keys match!")

    const walletAddr = this.getNextWalletAddr()
    const pk = await this.getWallet().getStore().getCachedPasscode()

    console.log("Adding private key")
    const store = await this.getWallet().getKeyStore(pk)

    const ok = await store.setPrivateKey(walletAddr.publicKey.toString(), this._mnemonic, pk)
    if (!ok) {
      console.log("unable to add private key")
      return
    }

    //Add to NS List
    console.log("Adding to NS list", walletAddr.publicKey.toString(), this._data.name)
    const nsMgr = this.getManager(NS_MANAGER)

    await nsMgr.addNamespace(walletAddr.publicKey.toString(), this._data.name)
    await nsMgr.setActiveNamespace(walletAddr.publicKey.toString())
    await this.getWallet().getStore().setWalletAddr(walletAddr.publicKey.toString())
    await this.getWallet().getStore().setWalletName(this._data.name)
    this.getRouter().navigateTo("tokens")
  }

  /**
   * Validate our user input matches the key correctly
   * @returns {boolean}
   */
  validateInputs() {
    const valid = []
    for (let i = 0; i < this.elems.length; i++) {
      valid.push(this.elems[i].value)
    }

    return this.inp.value === valid.join(" ")
  }

  clearInputs() {
    for (let i = 0; i < this.elems.length; i++) {
      this.elems[i].value = ""
    }
  }

  //First wallet key
  getNextWalletAddr(i = 0) {
    const seed = bip39.mnemonicToSeedSync(this._mnemonic, ""); // (mnemonic, password)
    const path = `m/44'/501'/${i}'/0'`;
    return Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    )
  }

  async getHtml() {
    this.setTitle("Save Secret");

    const walletName = this._data.name
    this._mnemonic = bip39.generateMnemonic();

    let validate = ``

    const msplit = this._mnemonic.split(" ")
    for (let i = 0; i < msplit.length; i++) {
      validate += `<input autocomplete="chrome-off" class="form-control key-input mt-1" id="validate-${i}" placeholder="${i}">`
    }

    return `<div class="container-fluid">
            <h4>${walletName}</h4>
            <h5>${this.title}</h5>

		<div class="col-12 text-start mt-2">
<!--		<p class="mt-2 small text-danger text-center">You must save this somewhere safe before continuing.</p>-->
		<h5>Secret Key</h5>
		<textarea rows="3" readonly="true" id="input" class="form-control key-output" style="width: 100%">${this._mnemonic}</textarea>
</div>
		<div class="col-12 text-start mt-2">
		<h5>Verify: <small class="text-danger" id="validate-error"></small></h5>
		${validate}
</div>
		<div class="col-12 text-center mt-3">
		    <button id="create-wallet" class="btn btn-primary btn-block">SAVE</button>
		<p class="small mt-2 text-danger text-center">Without this key you will NOT be able to recover your wallet.</p>
		</div>
	</div></div>`;
  }

  async onMounted(app) {
    await super.onMounted(app)
    this.nameInput = document.getElementById("name-input")
    document.getElementById("create-wallet").addEventListener("click", (e) => this.createWallet(e))


    this.inp = document.getElementById("input")
    this.elems = document.getElementsByClassName("key-input")
    this.error = document.getElementsByClassName("validate-error")
  }
}
