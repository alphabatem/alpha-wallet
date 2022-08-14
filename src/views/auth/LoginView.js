import AbstractView from "../../view.js";

export default class LoginView extends AbstractView {
  input
  form

  error = ""

  login(e) {
    e.preventDefault()
    this.error = ""

    if (this.input.value.length < 12) {
      //Min password requirements
      this.onError("Password too short")
      return false
    }

    this.getWallet().unlock(this.input.value).then(ok => {
      if (ok) {
        if (this._data.redirect_to)
          this.getRouter().navigateTo(this._data.redirect_to)
        else if (this.getWallet().isPinPluginEnabled())
          this.getRouter().navigateTo("wallets/set_pin", {pk: this.input.value})
        else
          this.getRouter().navigateTo("wallets/swap")
      } else {
        this.onError("Invalid password")
        this.input.focus()
      }
    }).catch(e => {
      console.error("unlock err", e)
      this.onError(e)
    })
      .finally(() => {
        this.input.value = "";
      })
  }

  onError(errorText) {
    this.error = errorText
    this._router.refresh()
  }

  async getHtml() {
    this.setTitle("Login");

    return `<div class="login text-center">
	<h1 class="mt-3">Login</h1>
	<p class="small mt-3">Enter your passcode to continue</p>


	<div class="row login-container mt-5">
	<form method="post" class="mt-5" id="login-form">
		<div class="col-12">
			<input autocomplete="chrome-off" id="input" type="password" class="form-control form-control-lg text-center" placeholder="Password">
		</div>

		<div class="col-12 text-center mt-3">
		    <p class="text-danger small">${this.error}</p>
		</div>

		<div class="col-12 text-center">
		    <button type="submit" class="btn btn-primary btn-block mt-5"><i class="fi fi-rr-angle-double-right"></i> LOGIN</button>
		</div>
		</form>
	</div>
</div>`;
  }


  async onMounted(app) {
    await super.onMounted(app)

    const passcodeSet = await this.getWallet().isPasscodeSet()
    if (!passcodeSet) {
      this.getRouter().navigateTo("set_passcode")
      return
    }

    this.input = document.getElementById("input")
    this.form = document.getElementById("login-form")

    this.form.addEventListener("submit", (e) => this.login(e))

    this.input.focus()
  }

  async onDismount() {
    this.form.removeEventListener("submit", (e) => this.login(e))
  }

}
