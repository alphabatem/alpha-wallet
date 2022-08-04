export default class {
  title = ""

  _wallet //AlphaWallet
  _router

  document

  constructor(router, wallet) {
    this._wallet = wallet;
    this._router = router
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

  async onMounted(app) {
    this.document = app
  }

  async onDismount() {
    //
  }


  getWallet() {
    return this._wallet
  }

  getRouter() {
    return this._router
  }
}
