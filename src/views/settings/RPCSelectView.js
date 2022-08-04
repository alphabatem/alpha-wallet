import AbstractView from "../view.js";

export default class RPCSelectView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("RPC Network");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
