import AbstractView from "../../view.js";
import {CFG_MGR} from "../../managers/core/configManager";

export default class LockTimeoutView extends AbstractView {

  async onClick(e) {
    const timeout = document.getElementById("input").value
    const timeoutMs = timeout * 60 * 1000
    await this.getManager(CFG_MGR).setConfigValue("lockTimeout", timeoutMs)
    this._router.navigateTo("settings")
  }

  async getHtml() {
    this.setTitle("Lock Timeout");


    const current = await this.getManager(CFG_MGR).getLockTimeout()
    const currentMinutes = current / 60 / 1000

    return `
            <h1>${this.title}</h1>

            <div class="col-10 mx-auto mt-5">
            <h5 class="text-start">Minutes:</h5><input id="input" class="form-control text-center mt-1 w-100" value="${currentMinutes}">
            <button id="update" class="btn btn-primary mt-5 btn-block w-100">UPDATE</button>
</div>`;
  }

  async onMounted(app) {
    super.onMounted(app);

    document.getElementById("update").addEventListener("click", (e) => this.onClick(e))
  }
}
