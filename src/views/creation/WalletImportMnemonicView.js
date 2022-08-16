import AbstractView from "../../view.js";
import {WALLET_MGR} from "../../managers/wallets/walletManager";
import {SOLANA_MANAGER} from "../../managers/solana/solanaManager";
import {NS_MANAGER} from "../../managers/core/namespaceManager";

export default class WalletImportMnemonicView extends AbstractView {
  passwordInput
  walletInput
  errorText

  error = ""

  validKeypairs = [];

  async importWallet(e) {
    this.clearError()
    this.validKeypairs = [];
    const keypairs = this.getManager(WALLET_MGR).mnemonicToKeypairs(this.walletInput.value, this.passwordInput.value)
    const solMgr = this.getManager(SOLANA_MANAGER)
    for (let i = 0; i < keypairs.length; i++) {
      const balance = await solMgr.rpc().getBalance(keypairs[i].publicKey.toString())
      if (balance > 0) {
        this.validKeypairs.push(keypairs[i])
        continue
      }

      break //0 balance must mean end of useful wallets?
    }

    if (this.validKeypairs.length === 0) {
      this.onError("No wallets with balance found")
      return
    }

    this.getRouter().navigateTo("auth/auth_action", {
      redirect_to: "wallets/swap",
      callback: (pk) => this.onAuthSuccess(pk)
    })
  }

  clearError() {
    this.errorText.innerText = ""
  }

  onError(errorText) {
    this.errorText.innerText = errorText
  }

  async onAuthSuccess(pk) {
    const nsMgr = this.getManager(NS_MANAGER)
    for (let i = 0; this.validKeypairs.length; i++) {
      const keypair = this.validKeypairs[i]
      const exists = nsMgr.namespaceExists(keypair.publicKey.toString())
      if (exists)
        continue

      await this.getManager(WALLET_MGR).importWallet(keypair.publicKey.toString(), keypair.privateKey, pk)
    }
  }

  async getHtml() {
    this.setTitle("Import Wallet");

    return `
            <h1>${this.title}</h1>

            <p class="small mt-3"><i>Never share your secret key with anyone.</i></p>

            <div class="row mt-5">
		<div class="col-12">
		  <h6>Password: </h6>
			<input autocomplete="chrome-off" id="passcode-input" type="password" class="form-control" placeholder="Password">
		</div>
		<div class="col-12 mt-3"></div>

		<div class="col-12 mt-3">
		    <h6>Secret Key:</h6>
			<textarea id="wallet-input" class="form-control" rows="5" placeholder="Secret Key"></textarea>
		</div>

		<div class="col-12 text-center mt-3">
		    <p class="text-danger small" id="error-text"></p>
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="import-wallet" class="btn btn-primary btn-block p-3">IMPORT</button>
		</div>
	</div>`;
  }

  async onMounted(app) {
    await super.onMounted(app)
    this.errorText = document.getElementById("error-text")
    this.passwordInput = document.getElementById("passcode-input")
    this.walletInput = document.getElementById("wallet-input")
    document.getElementById("import-wallet").addEventListener("click", (e) => this.importWallet(e))
  }
}
