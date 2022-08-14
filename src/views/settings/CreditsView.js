import AbstractView from "../../view.js";

export default class CreditsView extends AbstractView {


  async getHtml() {
    this.setTitle("Credits");
    return `
            <h1>${this.title}</h1>
            <p class="small mt-2">Made possible by the amazing people/companies below!</p>

            <div class="row mt-3">
            <div class="col-12"><p class="mb-2 fw-bold">Developers</p></div>
            <div class="col-12">
                <p><a class="twitter-link" target="_blank" href="https://twitter.com/alpha_batem">@AlphaBatem</a></p>
                <p><a class="twitter-link" target="_blank" href="https://twitter.com/CloakdDev">@CloakdDev</a></p>
            </div>

            <div class="col-12"><p class="mt-5">UIcons by <a target="_blank" href="https://www.flaticon.com/uicons">Flaticon</a></p></div>
            </div>
        `;
  }
}
