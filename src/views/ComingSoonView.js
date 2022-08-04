import AbstractView from "../view.js";

export default class ComingSoonView extends AbstractView {
  constructor(router, wallet) {
    super(router, wallet);
    this.setTitle("Coming Soon");
  }

  async getHtml() {
    return `<i class="small">Coming Soon!</i>`;
  }

  async onMounted() {
  }
}
