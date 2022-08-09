import AbstractView from "../../view.js";
import {CFG_MGR} from "../../managers/core/configManager";
import * as fs from "fs";

export default class RPCSelectView extends AbstractView {

  async onClick(e) {
    const selected = e.target.dataset.value
    await this.getManager(CFG_MGR).setConfigValue("rpcUrl", selected)
    this._router.refresh()
  }

  async getHtml() {
    this.setTitle("Default RPC");

    const current = this.getManager(CFG_MGR).getRPCUrl()

    const options = [
      {
        value: "ssc-dao.genesysgo.net",
        title: "Mainnet (GenesysGo)",
      },
      {
        value: "solana-api.projectserum.com",
        title: "Mainnet (Serum)",
      },
      {
        value: "api.mainnet-beta.solana.com",
        title: "Mainnet (Solana)",
      },
      {
        value: "api.devnet.solana.com",
        title: "Devnet",
      },
      {
        value: "api.testnet.solana.com",
        title: "Testnet",
      }
    ]

    let opts = ``
    let isCustom = true
    for (let i = 0; i < options.length; i++) {
      const opt = options[i]
      if (current === opt.value)
        isCustom = false

      opts += `<div class="card ns-card mt-2 ${current === opt.value ? 'active' :
        ''}" data-value="${opt.value}">
	<div class="card-body ns-card-body p-1">
        <h4>${opt.title}</h4>
        <p><code class="xsmall">${opt.value}</code></p>
	</div>
</div>`
    }


    const customOpt = `<div class="card ns-card mt-2 ${isCustom ? 'active' :
      ''}" data-link="settings/rpc/custom">
	<div class="card-body ns-card-body p-1">
        <h4>Custom</h4>
        <p><code class="xsmall">${isCustom ? current : 'Custom URL'}</code></p>
	</div>
</div>`

    return `
            <h1>${this.title}</h1>
<div class="options mt-5">${opts}${customOpt}</div>
           `;
  }

  async onMounted(app) {
    super.onMounted(app);

    const elems = document.getElementsByClassName("ns-card")
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", (e) => this.onClick(e))
    }
  }
}
