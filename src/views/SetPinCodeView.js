import {PIN_MGR} from "../managers/core/pinManager";
import PinCodeView from "./PinCodeView";

export default class SetPinCodeView extends PinCodeView {
  onSubmit(e) {
    const minLength = 5

    this.error = "";
    e.preventDefault()

    let code = this.getPincode()
    if (code !== "" && code.length < minLength) {
      return this.onValidationError("PIN too short")
    }

    const pinMgr = this.getManager(PIN_MGR)
    if (!pinMgr) {
      return this.onValidationError("Pin plugin not enabled!")
    }

    pinMgr.cachePasscodeWithPin(code, this._data.pk).then(r => {
      this.onUpdateResponse(r)
    }).catch(e => {
      this.onUpdateError(e)
    })
  }


  async getHtml() {
    const d = `<div class="col-12 text-center">
		    <p data-link="wallets/swap" class="link small mt-5">SKIP</p>
		</div>`

    this.setButtonText("LOGIN")
    this.addExtraDom(d)

    return super.getHtml();
  }


  onUpdateError(e) {
    console.error("Unable to update passcode", e)
  }

  onUpdateResponse(ok) {
    if (!ok) {
      console.error("Unable to update pincode")
      if (this.existingCode.value !== null)
        this.existingCode.value = ""
      this.newCode.value = ""

      return false
    }

    this.getRouter().navigateTo("wallets/swap")
  }
}
