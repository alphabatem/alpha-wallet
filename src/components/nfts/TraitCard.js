import AbstractView from "../../view";

export class TraitCard extends AbstractView {

  async getHtml() {
    const data = this._data.trait

    return `<div class="trait">
<h5>${data.value}</h5>
<h6>${data.trait_type}</h6>
    </div>`
  }
}
