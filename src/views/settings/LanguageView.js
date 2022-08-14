import AbstractView from "../../view.js";

export default class LanguageView extends AbstractView {

  async getHtml() {
    this.setTitle("Language");
    return `
            <h1>${this.title}</h1>


            <p class="mt-3">Currently only English is supported!</p>
        `;
  }
}
