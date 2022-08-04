import AbstractView from "../view.js";

export default class PluginsView extends AbstractView {
  constructor(router,wallet) {
    super(router,wallet);
    this.setTitle("Plugins");
  }

  //TODO setup click handler
  async getHtml() {
    return `
            <h1>${this.title}</h1>
            <p class="small mt-2">Click to toggle plugins, by disabling a plugin all code execution for that plugin is stopped.</p>

            <div class="row mt-3">
            <div class="col-12"><button class="btn btn-secondary btn-enabled btn-block btn-settings mt-2">Solana RPC</button></div>
            <div class="col-12"><button class="btn btn-secondary btn-enabled btn-block btn-settings mt-2">Tokens</button></div>
            <div class="col-12"><button class="btn btn-secondary btn-enabled btn-block btn-settings mt-2">NFTs</button></div>
            <div class="col-12"><button class="btn btn-secondary btn-enabled btn-block btn-settings mt-2">Transfer</button></div>
            <div class="col-12"><button class="btn btn-secondary btn-enabled btn-block btn-settings mt-2">Jupiter AG</button></div>
            </div>
        `;
  }
}
