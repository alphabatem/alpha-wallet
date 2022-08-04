export class ManagerContext {
  _managers = {}

  constructor(managers = []) {
    for (let i = 0; i < managers.length; i++) {
      this.addManager(managers[i])
    }
  }

  addManager(manager) {
    if (this._managers[manager.id()])
      throw new Error(`manager ${manager.id()} already registered`)

    this._managers[manager.id()] = manager
  }

  getManager(id) {
    return this._managers[id]
  }

  //Bind managers & call their configure method
  start() {
    for (let i = 0; i < this._managers.length; i++) {
      this._managers[i].configure(this)
    }

    return this
  }
}
