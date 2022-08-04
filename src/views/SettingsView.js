import AbstractView from "./view.js";

export default class SettingsView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Settings");
  }

  async getHtml() {
    return `
            <h1>Settings</h1>
        `;
  }
}
