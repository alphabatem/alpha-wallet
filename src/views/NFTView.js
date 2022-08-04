import AbstractView from "./view.js";

export default class NFTView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("NFT");
  }

  async getHtml() {
    return `
            <h1>NFT</h1>
        `;
  }
}
