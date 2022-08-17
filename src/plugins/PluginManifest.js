export default class PluginManifest {
  slug

  name
  version
  author

  icon = ""

  description = "Plugin description"

  indexPage
  settingsPage

  extraRoutes = [
    // {hash: "page_2", page: Page2View}
  ]

  permissions = []

  constructor(name = "Plugin Name", author = "Unknown", version = "1.0.0") {
    this.name = name
    this.slug = name.toLocaleLowerCase().replaceAll(" ", "_")

    this.version = version
    this.author = author
  }

  getSlug() {
    return this.slug
  }

  getView() {
    return this.indexPage
  }

  getSettingsView() {
    return this.settingsPage
  }

  hasExtraRoutes() {
    return this.extraRoutes.length > 0
  }

  getExtraRoutes() {
    return this.extraRoutes
  }


  setDescription(desc) {
    this.description = desc
    return this
  }

  setIcon(icon) {
    this.icon = icon
    return this
  }

  setIndexPage(view) {
    this.indexPage = view
    return this
  }

  setSettingsPage(view) {
    this.settingsPage = view
    return this
  }

  setRoutes(routes) {
    this.extraRoutes = routes
    return this
  }

  setPermissions(permissions) {
    this.permissions = permissions
  }

  addPermission(permission) {
    this.permissions.push(permission)
  }
}
