import AbstractView from "../view.js";

export default class LanguageView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Language");
  }

  async getHtml() {
    return `
            <h1>${this.title}</h1>
        `;
  }
}
