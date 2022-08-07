import AbstractView from "../../view.js";

export default class LockTimeoutView extends AbstractView {

  async getHtml() {
    this.setTitle("Lock Timeout");
    return `
            <h1>${this.title}</h1>
        `;
  }
}
