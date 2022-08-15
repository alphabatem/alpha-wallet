export class AbstractManager {
  ctx


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return "_default"
  }

  configure(ctx) {
    this.ctx = ctx
  }

  async start() {
    //
  }

  /**
   * Called before manager is removed from context
   */
  shutdown() {}

  getManager(id) {
    return this.ctx.getManager(id)
  }

  getStorageManager() {
    return this.getManager("storage_mgr")
  }

  getStore() {
    return this.getStorageManager().getWalletStore()
  }

}
