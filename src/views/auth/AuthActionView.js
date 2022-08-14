import AbstractView from "../../view.js";

export default class AuthActionView extends AbstractView {
  input
  form

  text = "Enter your password to approve this action"

  error = ""

  async onAuth(e) {
    e.preventDefault()
    this.error = ""

    await this._handleCallback()
    this.getRouter().navigateTo(this._data.redirect_to)
  }

  async _handleCallback() {
    const cb = this._data.callback
    if (!cb) {
      return
    }

    try {
      await cb(this.input.value)
    } catch (e) {
      console.error("Unable to run auth callback", e)
    }
  }

  onError(errorText) {
    this.error = errorText
    this._router.refresh()
  }

  async getHtml() {
    this.setTitle("Approve Action");

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
    if (!this._data.redirect_to || !this._data.callback) {
      console.log("Missing required _data attribute", ['redirect_to', 'callback'], this._data)
      return false
    }

    return super.beforeMount();
  }


  async onMounted(app) {
    await super.onMounted(app)

    this.input = document.getElementById("input")
    this.form = document.getElementById("login-form")

    if (this.form)
      this.form.addEventListener("submit", (e) => this.onAuth(e))

    if (this.input)
      this.input.focus()
  }

  async onDismount() {
    if (this.form)
      this.form.removeEventListener("submit", (e) => this.onAuth(e))
  }

}
