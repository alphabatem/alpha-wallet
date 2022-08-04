import AbstractView from "../../view.js";

export default class DefaultExplorerView extends AbstractView {
  constructor(router,wallet) {
    super(router,wallet);
    this.setTitle("Default Explorer");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
