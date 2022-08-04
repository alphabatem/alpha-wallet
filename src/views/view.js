export default class {
  title = ""

  constructor(params) {
    this.params = params;
  }

  setTitle(title) {
    document.title = title;
    this.title = title
  }

  getTitle() {
    return this.title
  }

  async getHtml() {
    return "";
  }
}
