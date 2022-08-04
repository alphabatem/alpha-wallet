import AbstractView from "./view.js";

export default class TransferView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Transfer");
  }

  async getHtml() {
    return `
            <h1>Transfer</h1>
            <p>Powered By Jupiter AG</p>
        `;
  }
}
