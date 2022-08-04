export default class {
  title = ""

  _wallet //AlphaWallet
  _router

  document

  constructor(router, wallet) {
    this._wallet = wallet;
    this._router = router
  }

  /**
   * Set page title
   *
   * @param title
   */
  setTitle(title) {
    document.title = title;
    this.title = title
  }

  /**
   * Get page title
   *
   * @returns {string}
   */
  getTitle() {
    return this.title
  }

  /**
   * Return the rendered html for the view
   *
   * @returns {Promise<string>}
   */
  async getHtml() {
    return "";
  }

  /**
   * Called each time a view is added
   *
   * @param app
   * @returns {Promise<void>}
   */
  async onMounted(app) {
    this.document = app
  }

  /**
   * Called each time a view is removed
   * @returns {Promise<void>}
   */
  async onDismount() {
    //
  }

  /**
   * Return the wallet instance
   *
   * @returns {*}
   */
  getWallet() {
    return this._wallet
  }

  /**
   * Return a manager from shared context
   * @param manager
   * @returns {*}
   */
  getManager(manager) {
    return this.getWallet().getManager(manager)
  }

  /**
   * Return our router instance for navigation
   *
   * @returns {*}
   */
  getRouter() {
    return this._router
  }
}
