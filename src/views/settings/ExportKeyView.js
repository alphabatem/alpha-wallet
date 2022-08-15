import {STORAGE_MGR} from "../../managers/storage/storageManager";
import {NS_MANAGER} from "../../managers/core/namespaceManager";
import AuthActionView from "../auth/AuthActionView";

export default class ExportKeyView extends AuthActionView {

  pk

  async onAuth(e) {
    e.preventDefault()

    await this.getManager(STORAGE_MGR).unlockKeyStore(this.input.value).catch(e => {
      this.onError(e)
    })
    const ks = await this.getManager(STORAGE_MGR).getKeyStore()

    const ns = this.getManager(NS_MANAGER).getActiveNamespace()
    this.pk = await ks.getPrivateKey(ns.key, this.input.value).catch(e => {
      this.onError(e)
    })
    this._router.refresh()
  }


  async getHtml() {
    this.setTitle("Export Key");

    if (this.pk) {
      return this.getHtmlAuthed()
    }
    return this.getHtmlNoAuth()
  }


  async beforeMount() {
    //Do nothing
    return true
  }

  async getHtmlNoAuth() {
    return super.getHtml()
  }

  async getHtmlAuthed() {
    return `
            <h1>${this.title}</h1>

            <p class="small mt-3"><i>Never share your private key with anyone.</i></p>

            <div class="row mt-5">

		<div class="col-12 mt-3">
			<textarea id="wallet-input" class="form-control" rows="5" placeholder="Private Key">${this.pk}</textarea>
		</div>

		<div class="col-12 text-center mt-3">
		    <button id="back" class="btn btn-primary btn-block p-3">BACK</button>
		</div>
	</div>
        `;
  }

  async onMounted(app) {
    super.onMounted(app);

    const back = document.getElementById("back")
    if (back)
      back.addEventListener("click", (e) => this.onBack(e))
  }

  async onDismount() {
    super.onDismount();

    const back = document.getElementById("back")
    if (back)
      back.removeEventListener("click", (e) => this.onBack(e))
  }

  onBack() {
    this.getRouter().navigateTo("settings")
  }
}
