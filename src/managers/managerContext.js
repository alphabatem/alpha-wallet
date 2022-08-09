export class ManagerContext {

  _managers = {}

  _plugins = []

  constructor(managers = []) {
    for (let i = 0; i < managers.length; i++) {
      this.addManager(managers[i])
    }
  }

  addPlugins(...managers) {
    const plugins = [];
    for (let i = 0; i < managers.length; i++) {
      plugins.push(managers[i].id())
      this.addManager(managers[i])
    }

    //Configure newly added plugins (done after we add all plugins for
    // dependencies)
    for (let i = 0; i < plugins.length;i++){
      this._managers[plugins[i]].configure(this)
    }

    this._plugins.push(...plugins)
  }

  addManager(manager) {
    console.debug("Adding manager", manager.id())
    if (this._managers[manager.id()])
      throw new Error(`manager ${manager.id()} already registered`)

    this._managers[manager.id()] = manager
  }

  getManager(id) {
    return this._managers[id]
  }

  removeManager(id) {
    if (!this._managers[id])
      return

    try {
      this._managers[id].shutdown()
    } catch (e) {
      console.log(`${id} onDismount err:`, e)
    }

    delete this._managers[id]
  }

  /**
   * Remove all plugins from the registered context
   */
  removeAllPlugins() {
    for (let i = 0; i < this._plugins.length; i++) {
      this.removeManager(this._plugins[i])
    }
    this._plugins = [];
  }

  //Bind managers & call their configure method
  start() {

    const ok = Object.keys(this._managers)

    for (let i = 0; i < ok.length; i++) {
      console.debug("Configuring", this._managers[ok[i]].id())
      this._managers[ok[i]].configure(this)
    }

    return this
  }
}
