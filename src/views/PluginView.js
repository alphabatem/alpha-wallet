import AbstractView from "../view.js";
import {PluginCard} from "../components/plugins/PluginCard";

export default class PluginView extends AbstractView {


  plugins = [
    {
      name: "AlphaBatem",
      link: "alphabatem",
      icon: "https://shdw-drive.genesysgo.net/HF179Vyc4mC9vvpL1TypZqJFqHEf6qQwJSpjbRB4sWnh/alphabatem.png"
    },
    {
      name: "Blok Host",
      link: "blok_host",
      icon: "https://shdw-drive.genesysgo.net/HF179Vyc4mC9vvpL1TypZqJFqHEf6qQwJSpjbRB4sWnh/blok_host.jpg"
    },
    {
      name: "Shadow Drive",
      link: "shdw_drive",
      icon: "https://shdw-drive.genesysgo.net/HF179Vyc4mC9vvpL1TypZqJFqHEf6qQwJSpjbRB4sWnh/shdw_drive.jpg"
    },
    {
      name: "Jupiter AG",
      link: "jup_ag",
      icon: "https://shdw-drive.genesysgo.net/HF179Vyc4mC9vvpL1TypZqJFqHEf6qQwJSpjbRB4sWnh/jup_ag.svg"
    },
    {
      name: "Sonar Watch",
      link: "sonar_watch",
      icon: "https://shdw-drive.genesysgo.net/HF179Vyc4mC9vvpL1TypZqJFqHEf6qQwJSpjbRB4sWnh/sonar_watch.png"
    },
    {
      name: "Validators.app",
      link: "validators_app",
      icon: "https://shdw-drive.genesysgo.net/HF179Vyc4mC9vvpL1TypZqJFqHEf6qQwJSpjbRB4sWnh/validators_app.png"
    }
  ]


  async getHtml() {
    this.setTitle("Plugins");


    let pluginList = ``;
    for (let i = 0; i < this.plugins.length; i++) {
      pluginList += await this.addSubView(PluginCard, {plugin: this.plugins[i]}).getHtml()
    }


    return `<div class="plugins text-center">
	<h2 class="text-upper">${this.title}</h2>
	<div class="row">${pluginList}</div>
	<button data-link="plugin_hub" class="btn btn-secondary btn-block mt-5">FIND PLUGINS</button>
</div>`;
  }
}
