import AbstractView from "../view.js";

export default class NFTView extends AbstractView {
  constructor(router,wallet) {
    super(router,wallet);
    this.setTitle("NFT");
  }

  async getHtml() {
    return `
            <h1>NFT</h1>
        `;
  }
}
