import AbstractView from "./view.js";

export default class SettingsView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Settings");
  }

  async getHtml() {
    return `
            <h1>Settings</h1>

            <div class="row mt-2">
            <div class="col-12"><button data-link="settings/language" class="btn btn-secondary btn-block btn-settings mt-2">Language</button></div>
            <div class="col-12"><button data-link="settings/trusted_apps" class="btn btn-secondary btn-block btn-settings mt-2">Trusted Apps</button></div>
            <div class="col-12"><button data-link="settings/rpc" class="btn btn-secondary btn-block btn-settings mt-2">RPC</button></div>
            <div class="col-12"><button data-link="settings/lock_timeout" class="btn btn-secondary btn-block btn-settings mt-2">Lock Timeout</button></div>
            <div class="col-12"><button data-link="settings/default_explorer" class="btn btn-secondary btn-block btn-settings mt-2">Default Explorer</button></div>
</div>

<div class="row mt-2">
            <div class="col-12"><button class="btn btn-danger btn-block btn-settings mt-2">Export Private Key</button></div>
            <div class="col-12"><button class="btn btn-danger btn-block btn-settings mt-2">Remove Wallet</button></div>
</div>
        `;
  }
}
