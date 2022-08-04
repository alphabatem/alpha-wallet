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
    this.ctx = ctx
  }

  getManager(id) {
    return this.ctx.getManager(id)
  }

  storageKey(key) {
    return `${this.id()}:${key}`
  }

}