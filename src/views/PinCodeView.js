import AbstractView from "../view.js";

export default class PinCodeView extends AbstractView {
  error = ""

  buttonText = "SET"

  extraDom = ``

  pinCodeParent

  setButtonText(text) {
    this.buttonText = text
  }

  addExtraDom(d) {
    this.extraDom = d
  }

  getFullCode(parentElem) {
    let code = ``
    for (let i = 0; i < parentElem.children.length; i++) {
      code += `${parentElem.children[i].value}`
    }
    return code
  }

  getPincode() {
    return this.getFullCode(this.pinCodeParent)
  }

  onSubmit(e) {
    //
  }

  onValidationError(error) {
    this.error = error
    this._router.refresh()
    return false
  }

  getInfoDom() {
    return `
	<p class="small">Create a secure passcode for your wallet.</p>
  <p class="small mt-5" style="line-height: 1em">This PIN is used to secure your passcode for the lockout period.</p>`
  }



  async getHtml() {

    const infoDom = this.getInfoDom();

    return `<div class="login text-center" style="height: 100%">
	<h1 class="mt-3">${this.title}</h1>

	<div class="row login-container mt-3">

	<div class="col-10 mx-auto mb-5">
	${infoDom}
</div>

	<form method="post" id="update-code-form">
		<div class="col-12">
			<div class="code-container">
	<input id="code-1" tabindex="0" class="form-control pin-control" type="password" maxlength="1">
	<input id="code-2" tabindex="1" class="form-control pin-control" type="password" maxlength="1">
	<input id="code-3" tabindex="2" class="form-control pin-control" type="password" maxlength="1">
	<input id="code-4" tabindex="3" class="form-control pin-control" type="password" maxlength="1">
	<input id="code-5" tabindex="4" class="form-control pin-control" type="password" maxlength="1">
	<input id="code-6" tabindex="5" class="form-control pin-control" type="password" maxlength="1">
</div>
		</div>

		<div class="col-12 text-center mt-2">
		    <p class="small text-danger">${this.error}</p>
		</div>

		<div class="col-12 text-center mt-2">
		    <button id="submit-button" tabindex="6" type="submit" class="btn btn-primary btn-block mt-5">${this.buttonText}</button>
		</div>
		</form>
		${this.extraDom}
	</div>
</div>`;
  }

  onKeyUpDone(e) {
    document.getElementById("submit-button").focus()
    this.onSubmit(e)
  }

  onKeyUp(e) {
    var target = e.srcElement || e.target;

    var isWordCharacter = e.key.length === 1;
    var isBackspaceOrDelete = e.keyCode === 8 || e.keyCode === 46;


    if (isWordCharacter) {
      target.value = e.key

      let next = target;
      while (next = next.nextElementSibling) {
        if (next == null)
          break;
        if (next.tagName.toLowerCase() === "input") {
          next.focus();
          break;
        }
      }
      return
    }
    // Move to previous field if empty (user pressed backspace)
    else if (isBackspaceOrDelete) {
      target.value = ''
      let previous = target;
      while (previous = previous.previousElementSibling) {
        if (previous == null)
          break;
        if (previous.tagName.toLowerCase() === "input") {
          previous.focus();
          break;
        }
      }
      return;
    }
  }

  async beforeMount() {
    this.setTitle("Set Session PIN");

    return super.beforeMount();
  }

  async onDismount() {
    super.onDismount();

    if (this.pinCodeParent)
      this.pinCodeParent.removeEventListener("keyup", this.onKeyUp)
  }

  async onMounted(app) {
    super.onMounted(app)

    this.pinCodeParent = document.getElementsByClassName("code-container")[0]
    if (!this.pinCodeParent)
      return


    this.pinCodeParent.addEventListener("keyup", this.onKeyUp)
    document.getElementById("code-6").addEventListener("keyup", (e) => this.onKeyUpDone(e))


    this.pinCodeParent.children[0].focus()

    document.getElementById("update-code-form").addEventListener("submit", (e) => this.onSubmit(e))
  }
}
