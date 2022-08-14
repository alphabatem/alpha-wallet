import {AbstractManager} from "../abstractManager";

export class PluginManager extends AbstractManager {



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


  /**
   * Context ID
   *
   * @returns {string}
   */
  id() {
    return PLUGIN_MGR
  }

  /**
   * Register a new external plugin
   * @returns {Promise<boolean>}
   */
  async registerPlugin(plugin) {
    let ok = await this._registerView()
    if (!ok) return false
    ok = await this._registerMenuCard()
    if (!ok) return false
    ok = await this._registerSettingsView()
    if (!ok) return false

    ok = await this._registerRoute()
  }

  async _registerView() {
  }

  async _registerMenuCard() {
  }

  async _registerSettingsView() {

  }

  async _registerRoute() {

  }

}

export const PLUGIN_MGR = "plugin_mgr"
