import AbstractView from "../../view";

export class SendTokenView extends AbstractView {

  async getHtml() {
    this.setTitle("Send Tokens")

    console.log("Tokens", this._data.tokens)


    //TODO Send multiple tokens

    //TODO Get recipient


    return `<h1>${this.title}</h1>

    ${JSON.stringify(this._data.tokens)}
    `;
  }

}
