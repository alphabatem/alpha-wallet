import AbstractView from "../view.js";

export default class ComingSoonView extends AbstractView {

  async getHtml() {
    this.setTitle("Coming Soon");

    return `<i class="small">Coming Soon!</i>`;
  }

  async onMounted() {
  }
}
