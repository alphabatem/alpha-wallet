import PinCodeView from "../PinCodeView";

export default class LoginPinCodeView extends PinCodeView {

  async getHtml() {

    const d = `<div class="col-12 text-center">
		    <p data-link="login" class="link small mt-5">Login With Passcode</p>
		</div>`

    this.addExtraDom(d)

    return super.getHtml();
  }

  async beforeMount() {
    this.setButtonText("LOGIN")


    return super.beforeMount();
  }

  getInfoDom() {
    this.setTitle("Login");
    return `<p class="small">Enter your PIN to continue</p>`
  }

  /**
   * Override pin code call to login instead
   * @param e
   * @returns {boolean}
   */
  onSubmit(e) {
    e.preventDefault()

    let code = this.getPincode()
    this.getWallet().unlock(null, code).then(r => {
      this.onUpdateResponse(r)
    }).catch(e => {
      this.onUpdateError(e)
    })
  }

  onUpdateError(e) {
    console.error("Unable to update passcode", e)
    this.onValidationError(e)
  }

  onUpdateResponse(ok) {
    if (!ok) {
      this.onValidationError("Invalid pin")
      if (this.existingCode.value !== null)
        this.existingCode.value = ""
      this.newCode.value = ""

      return false
    }

    if (this._data.redirect_to)
      this.getRouter().navigateTo(this._data.redirect_to)
    else {
console.log("Navigating to tokens")
      this.getRouter().navigateTo("tokens")
    }
  }
}
