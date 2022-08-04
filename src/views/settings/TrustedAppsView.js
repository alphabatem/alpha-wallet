import AbstractView from "../view.js";

export default class TrustedAppsView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Trusted Apps");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
