import PluginManifest from "../../PluginManifest";

export class BlokHost extends PluginManifest {
  constructor() {
    super("Blok Host", "@CloakdDev");

    this.setDescription("Blok Host web hosting")
    this.setIcon("logo.jpg")
  }
}
