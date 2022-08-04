import AbstractView from "../view.js";

export default class LockTimeoutView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Lock Timeout");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
