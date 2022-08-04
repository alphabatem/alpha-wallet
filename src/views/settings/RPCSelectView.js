import AbstractView from "../../view.js";

export default class RPCSelectView extends AbstractView {
  constructor(router,wallet) {
    super(router,wallet);
    this.setTitle("RPC Network");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
