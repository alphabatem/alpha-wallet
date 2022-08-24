import AbstractView from "../view.js";
import {PluginCard} from "../components/plugins/PluginCard";
import {PLUGIN_MGR} from "../managers/plugins/pluginManager";

export default class PluginView extends AbstractView {

  async getHtml() {
    this.setTitle("Plugins");

    const mgr = this.getManager(PLUGIN_MGR)
    const plugins = mgr.getRegisteredPlugins()


    let pluginList = ``;
    for (let i = 0; i < plugins.length; i++) {
      pluginList += await this.addSubView(PluginCard, {plugin: plugins[i]}).getHtml()
    }


    return `<div class="plugins text-center p-2">
	<div class="row">${pluginList}</div>
	<button data-link="plugin_hub" class="btn btn-secondary btn-block mt-5">FIND PLUGINS</button>
</div>`;
  }
}
