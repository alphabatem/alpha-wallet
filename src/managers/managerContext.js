export class ManagerContext {
  _managers = {}

  constructor(managers = []) {
    for (let i = 0; i < managers.length; i++) {
      this.addManager(managers[i])
    }
  }

  addManager(manager) {
    console.log("Adding manager", manager.id())
    if (this._managers[manager.id()])
      throw new Error(`manager ${manager.id()} already registered`)

    this._managers[manager.id()] = manager
  }

  getManager(id) {
    return this._managers[id]
  }

  //Bind managers & call their configure method
  start() {

    const ok = Object.keys(this._managers)

    console.log(`Starting ${ok.length}`)
    for (let i = 0; i < ok.length; i++) {
      console.log("Configuring", this._managers[ok[i]].id())
      this._managers[ok[i]].configure(this)
    }

    return this
  }
}
