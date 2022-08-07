import {STORAGE_MGR} from "./storage/storageManager";

export class AbstractManager {
  ctx

  id() {
    return "_default"
  }

  configure(ctx) {
    this.ctx = ctx
  }

  getManager(id) {
    return this.ctx.getManager(id)
  }

  getStore() {
    return this.getManager(STORAGE_MGR)
  }

  getWalletStore() {
    return this.getStore().getWalletStore()
  }

}
