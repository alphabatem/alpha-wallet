export default class AbstractView {
  title = ""

  _wallet //AlphaWallet
  _router

  document

  _data = {}

  constructor(router, wallet, data = {}) {
    this._wallet = wallet;
    this._router = router
    this._data = data
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
   * Called when view is mounted, before getHtml
   *
   * @param app
   * @returns {Promise<boolean>}
   */
  async beforeMount() {
    return true
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
   * Returns the wallet address
   * @returns {Promise<*|null>}
   */
  async getWalletAddr() {
    return this._wallet.getStore().getWalletAddr()
  }

  /**
   * Returns the view data (if set)
   * @returns {{}}
   */
  getData() {
    return this._data
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

  /**
   * Add a sub view & bind with required items to satisfy interface
   * @param view
   * @param data
   * @returns {*}
   */
  addSubView(view, data = {}) {
    return new view(this._router, this._wallet, data)
  }
}
