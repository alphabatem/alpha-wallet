export class Manager {
  ctx
  store

  constructor(store) {
    this.store = store
  }

  id() {
    return "_default"
  }

  configure(ctx) {
    console.log("setting ctx", ctx)
    this.ctx = ctx
  }

  getManager(id) {
    console.log("Getting mgr", this.ctx)
    return this.ctx.getManager(id)
  }

  storageKey(key) {
    return `${this.id()}:${key}`
  }

}
