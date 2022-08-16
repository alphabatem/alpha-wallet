import PinCodeView from "../PinCodeView";
import {LOCK_MGR} from "../../managers/core/lockManager";
import {PIN_MGR} from "../../managers/core/pinManager";

export default class AuthActionView extends PinCodeView {
  input
  form

  text = "Enter your password to approve this action"

  error = ""

  isPincode = false

  async onSubmit(e) {
    e.preventDefault()
    this.error = ""


    if (this.isPincode) {
      await this.getWallet().unlock(null, this.getPincode()).catch(e => {
        this.onError(e)
      })
    } else {
      await this.getWallet().unlock(this.input.value).catch(e => {
        this.onError(e)
      })
    }

    const mgr = this.getManager(LOCK_MGR)
    if (!mgr || mgr.isLocked()) return

    let ok
    if (this.isPincode) {
      const v = await mgr.fromPincode(this.getPincode()).catch(e => {
        console.error("mgr::fromPincode", e)
        this.onError(e)
      })
      if (!v)
        return

      ok = await this._handleCallback(v)
    } else {
      ok = await this._handleCallback(this.input.value)
    }

    if (!ok)
      return

    if (this._data.redirect_to) {
      console.log("Redirecting to", this._data.redirect_to)
      this.getRouter().navigateTo(this._data.redirect_to)
    }
  }

  async _handleCallback(v) {
    const cb = this._data.callback
    if (!cb) {
      return true
    }

    await cb(v).catch(e => {
      this.onError(e)
      return false
    })

    return true
  }

  onError(errorText) {
    this.error = errorText
    this._router.refresh()
  }

  getInfoDom() {
    return `<p>Enter your session PIN to sign this action</p>`
  }

  async getHtml() {
    this.setTitle("Approve Action");
    this.setButtonText("APPROVE")

    if (this.isPincode)
      return this.getHtmlPinCode()

    return this.getHtmlPasscode()
  }

  async getHtmlPinCode() {
    return super.getHtml() //Pin code HTML
  }

  async getHtmlPasscode() {
    return `<div class="login text-center">
	<h1 class="mt-3">${this.title}</h1>
	<p class="small mt-3">${this.text}</p>


	<div class="row login-container mt-5">
	<form method="post" class="mt-5" id="login-form">
		<div class="col-12">
			<input autocomplete="chrome-off" id="input" type="password" class="form-control form-control-lg text-center" placeholder="Password">
		</div>

		<div class="col-12 text-center mt-3">
		    <p class="text-danger small">${this.error}</p>
		</div>

		<div class="col-12 text-center">
		    <button type="submit" class="btn btn-primary btn-block mt-5"><i class="fi fi-rr-angle-double-right"></i> APPROVE</button>
		</div>
		</form>
	</div>
</div>`;
  }

  async beforeMount() {
    if (!this._data.callback) {
      console.log("Missing required _data attribute", ['callback'], this._data)
      return false
    }

    this.isPincode = false
    const mgr = this.getManager(PIN_MGR)
    if (mgr)
      this.isPincode = await mgr.isPinCodeSet()

    return super.beforeMount();
  }


  async onMounted(app) {
    await super.onMounted(app)

    this.input = document.getElementById("input")
    this.form = document.getElementById("login-form")

    if (this.form)
      this.form.addEventListener("submit", (e) => this.onSubmit(e))

    if (this.input)
      this.input.focus()
  }

  async onDismount() {
    await super.onDismount()

    if (this.form)
      this.form.removeEventListener("submit", (e) => this.onSubmit(e))
  }

}
