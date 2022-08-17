import {AbstractManager} from "../abstractManager";
import * as Plugins from "../../plugins/3rd_party";

export class PluginManager extends AbstractManager {

  _router

  _plugins = {
    //
  }

  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return PLUGIN_MGR
  }

  /**
   * Responsibilities:
   * - Register external plugins
   *  - Plugin Main View
   *  - Plugin Card in PluginView
   *  - Settings in PluginSettings
   * - Handle disable/enable of plugins from user config
   *  - Permissions
   *    - Needs more thought but no reason to allow full access for plugins
   * @returns {string}
   */



  constructor(router) {
    super();

    this._router = router

    const keys = Object.keys(Plugins)
    console.log("Plugins", keys)

    for (let i = 0; i < keys.length; i++) {
      const plugin = new Plugins[keys[i]]
      this.register(plugin)
    }
  }

  getRegisteredPlugins() {
    const obs = Object.values(this._plugins)
    const plugs = [];

    for (let i = 0;i < obs.length;i++) {
      plugs.push({
        name: obs[i].getName(),
        icon: obs[i].getIcon(),
        slug: obs[i].getSlug(),
        link: `plugins/${obs[i].getSlug()}/index`
      })
    }
    return plugs
  }


  /**
   * Register a new external plugin
   * @returns {Promise<boolean>}
   */
  register(plugin) {
    console.log("Registering", plugin.getSlug())
    this._registerPlugin(plugin).then(r => {
      console.log("Plugin registered", plugin.getSlug())
    })
  }


  async _registerPlugin(plugin) {
    this._plugins[plugin.getSlug()] = plugin

    let ok = await this._registerMenuCard(plugin)
    if (!ok) return false

    ok = await this._registerSettingsView(plugin)
    if (!ok) return false

    ok = await this._registerRoute(plugin)
    return ok
  }

  async _registerMenuCard(plugin) {
  }

  /**
   * Registers the settings view into plugin settings *if set*
   * @param plugin
   * @returns {Promise<void>}
   * @private
   */
  async _registerSettingsView(plugin) {
    //TODO
  }

  /**
   * Registers the plugins routes into our router
   * @param plugin
   * @returns {Promise<void>}
   * @private
   */
  async _registerRoute(plugin) {
    const slug = plugin.getSlug()
    const hash = `${slug}/index`

    this._router.addPluginRoute(hash, plugin.getView())

    if (plugin.getSettingsView())
      this._router.addSettingRoute(slug, plugin.getSettingsView())

    if (plugin.hasExtraRoutes()) {
      const routes = plugin.getExtraRoutes()
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        this._router.addPluginRoute(`${slug}/${route.hash}`, route.view)
      }
    }

  }

}

export const PLUGIN_MGR = "plugin_mgr"
