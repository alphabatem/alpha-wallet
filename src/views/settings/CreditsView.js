import AbstractView from "../../view.js";

export default class CreditsView extends AbstractView {


  async getHtml() {
    this.setTitle("Credits");
    return `
            <h1>${this.title}</h1>
            <p class="small mt-2">Made possible by the amazing people/companies below!</p>

            <div class="row mt-3">
            <div class="col-12">Core Dev <a href="https://twitter.com/CloakdDev">CloakdDev</a></div>

            <div class="col-12 mt-4">UIcons by <a href="https://www.flaticon.com/uicons">Flaticon</a></div>
            </div>
        `;
  }
}
