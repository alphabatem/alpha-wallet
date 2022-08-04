import AbstractView from "../view.js";

export default class LockTimeoutView extends AbstractView {
  constructor(router,wallet) {
    super(router,wallet);
    this.setTitle("Lock Timeout");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
