import AbstractView from "../../view.js";
import * as bip39 from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";

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


    //TODO communicate with keyStore not walletStore
    const ok = await this.getWallet().getStore().getKeyStore().addPrivateKey("", this._mnemonic)

    //TODO add as namespace PK

    this._mnemonic = ""
  }

  /**
   * Validate our user input matches the key correctly
   * @returns {boolean}
   */
  validateInputs() {
    const valid = []
    for(let i =0; i < this.elems.length; i++) {
      valid.push(this.elems[i].value)
    }

    return this.inp.value === valid.join(" ")
  }

  clearInputs() {
    for(let i =0; i < this.elems.length; i++) {
      this.elems[i].value = ""
    }
  }

  async getHtml() {
    this.setTitle("Save Secret");

    const walletName = this._data.name
    this._mnemonic = bip39.generateMnemonic();
    for (let i = 0; i < 10; i++) {
      const path = `m/44'/501'/${i}'/0'`;
      const keypair = Keypair.fromSeed(
        derivePath(path, this._mnemonic.toString("hex")).key
      );
      console.log(`${path} => ${keypair.publicKey.toBase58()}`);
    }

    let validate = ``

    const msplit = this._mnemonic.split(" ")
    for (let i = 0; i < msplit.length; i++) {
      validate += `<input class="form-control key-input mt-1" id="validate-${i}" placeholder="${i}">`
    }

    return `<div class="container-fluid">
            <h6></h6>
            <h1>${walletName}</h1>
            <h5>${this.title}</h5>

		<div class="col-12 text-start mt-2">
		<p class="mt-2 small text-danger text-center">You must save this somewhere safe before continuing.</p>
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
