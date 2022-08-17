import AbstractView from "../../view.js";

export class PluginCard extends AbstractView {
  // _data = {plugin: {}}

  async onMounted(app) {
    super.onMounted(app);
  }

  async getHtml() {
    const plugin = this._data.plugin

    return `<div class="col-4"><div class="card m-2 plugin-card-container">
    <div data-link="${plugin.link}" data-plugin="${plugin.name}" class="nft-card" style="background-image: url('${plugin.icon}'); background-size: cover; background-position: center"></div>
		<div class="nft-detail noselect"><span class="small">${plugin.name}</span></div>
</div>
</div>`
  }
}
