import AbstractView from "../view.js";

export default class SetPasscodeView extends AbstractView {
  error = ""

  existingCode
  newCode

  async beforeMount() {
    return super.beforeMount();
  }

  updatePasscode(e) {
    this.error = "";
    e.preventDefault()

    if (this.existingCode.value !== "" && this.existingCode.value.length < 12) {
      return this.onValidationError("Existing code too short")
    }

    if (this.newCode.value.length < 12) {
      return this.onValidationError("New code too short")
    }

    console.log("Setting passcode")
    this.getWallet().isPasscodeSet().then(ok => {
      if (ok)
        this.getWallet().getStore().setPasscode(this.existingCode.value, this.newCode.value).then(r => this.onUpdateResponse(r)).catch(r => this.onValidationError(r))
      else
        this.getWallet().getStore().setPasscode(null, this.newCode.value).then(r => this.onUpdateResponse(r)).catch(r => this.onValidationError(r))
    }).catch(e => {
      this.onValidationError(e)
    })
  }

  onValidationError(error) {
    this.error = error
    this._router.refresh()
    return false
  }

  onUpdateResponse(ok) {
    if (!ok) {
      console.error("Unable to update passcode")
      if (this.existingCode.value !== null)
        this.existingCode.value = ""
      this.newCode.value = ""

      return false
    }

    this.getWallet().getStore().getPasscodeHash().then(r => {
      this.getRouter().navigateTo("login")
    }).catch(e => {
      console.error("Passcode hash missing", e)
    })

  }

  async getHtml() {
    this.setTitle("Set Passcode");

    const isPasscodeSet = await this.getWallet().isPasscodeSet()
    if (!isPasscodeSet) {
      const walletUnlocked = await this.getWallet().unlock("").catch((e) => console.error("unlock err", e))
      if (!walletUnlocked) {
        return `<div> <h4 class="mt-5">Unable to unlock wallet</h4> </div>`
      }
    }


    return `<div class="login text-center" style="height: 100%">
	<h1 class="mt-3">${this.title}</h1>
	<p class="small mt-3">Create a secure passcode for your wallet.</p>


	<div class="row login-container mt-3">
	<form method="post" id="update-code-form">
		<div class="col-12">
			<input autocomplete="chrome-off" id="existing-input" type="password" hidden="${!isPasscodeSet}" class="form-control" placeholder="">
		</div>
		<div class="col-12">
			<input autocomplete="chrome-off" id="new-input" type="password" class="form-control" placeholder="">
		</div>

		<div class="col-12 text-center">
		    <button type="submit" class="btn btn-primary btn-block mt-5">${isPasscodeSet ? 'UPDATE' : 'CREATE'}</button>
		</div>

		<div class="col-12 text-center">
		    <p>${this.error}</p>
		</div>
		</form>
	</div>
</div>`;
  }


  async onMounted(app) {
    super.onMounted(app)

    this.existingCode = document.getElementById("existing-input")
    this.newCode = document.getElementById("new-input")

    const form = document.getElementById("update-code-form")
    if (form)
      form.addEventListener("submit", (e) => this.updatePasscode(e))
  }
}
