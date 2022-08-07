import AbstractView from "../../view.js";

export default class TrustedAppsView extends AbstractView {

  async getHtml() {
    this.setTitle("Trusted Apps");
    return `
            <h1>${this.title}</h1>
        `;
  }
}
