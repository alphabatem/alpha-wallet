import AbstractView from "../../view";

export class SelectTokenView extends AbstractView {


  async onMounted(app) {
    await super.onMounted(app);

    document.getElementsByClassName()
  }

  async getHtml() {
    let options = ``
    const tokens = this._data.tokens
    for (let i = 0; i < tokens.length; i++) {
      options += this.addSubView(TokenSelect, {token: tokens[i]})
    }

    return `<select>${options}</select>`
  }

}

class TokenSelect extends AbstractView {

  async getHtml() {
    const token = this._data.token

    return `<option value="${token.mint}">${token.name}</option>`
  }

}
