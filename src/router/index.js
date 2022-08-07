import TokenView from "../views/TokenView.js";
import NFTView from "../views/NFTView.js";
import SettingsView from "../views/SettingsView.js";
import LanguageView from "../views/settings/LanguageView";
import TrustedAppsView from "../views/settings/TrustedAppsView";
import RPCSelectView from "../views/settings/RPCSelectView";
import LockTimeoutView from "../views/settings/LockTimeoutView";
import DefaultExplorerView from "../views/settings/DefaultExplorerView";
import PluginSettingsView from "../views/settings/PluginsView";
import LoginView from "../views/LoginView";
import SetPasscodeView from "../views/SetPasscodeView";
import WalletNameView from "../views/settings/WalletNameView";
import ComingSoonView from "../views/ComingSoonView";
import NFTShowView from "../views/NFTShowView";
import PluginView from "../views/PluginView";
import TokenShowView from "../views/TokenShowView";
import SwapWalletView from "../views/SwapWalletView";
import AddWalletView from "../views/creation/AddWalletView";
import WalletCreateView from "../views/creation/WalletCreateView";
import WalletImportView from "../views/creation/WalletImportView";
import WalletCreateSaveView from "../views/creation/WalletCreateSaveView";

const _routes = [
  {hash: "login", view: LoginView},
  {hash: "tokens", view: TokenView},
  {hash: "tokens/show", view: TokenShowView},
  {hash: "nft", view: NFTView},
  {hash: "nft/show", view: NFTShowView},

  {hash: "transfer/deposit", view: ComingSoonView},
  {hash: "transfer/send", view: ComingSoonView},

  {hash: "plugins", view: PluginView},
  {hash: "plugin_hub", view: ComingSoonView},
  {hash: "settings", view: SettingsView},
  {hash: "set_passcode", view: SetPasscodeView},

  {hash: "wallets/swap", view: SwapWalletView},
  {hash: "wallets/add", view: AddWalletView},
  {hash: "wallets/create", view: WalletCreateView},
  {hash: "wallets/create/save", view: WalletCreateSaveView},
  {hash: "wallets/import", view: WalletImportView},
  {hash: "wallets/connect", view: ComingSoonView},

  //Used to set wallet_addr prior to wallet creation implemented
  {hash: "settings/wallet_name", view: WalletNameView},

  {hash: "settings/trusted_apps", view: TrustedAppsView},
  {hash: "settings/language", view: LanguageView},
  {hash: "settings/rpc", view: RPCSelectView},
  {hash: "settings/lock_timeout", view: LockTimeoutView},
  {hash: "settings/default_explorer", view: DefaultExplorerView},
  {hash: "settings/plugins", view: PluginSettingsView},
]

export class Router {

  appContainer

  wallet

  currentView

  pluginRoutes = [];

  constructor(wallet) {
    this.wallet = wallet
  }

  navigateTo(hash, data = {}) {
    history.pushState(null, null, hash);
    return this.onNavigate(hash, data);
  };

  /**
   * Returns routes & plugin routes
   * @returns {[]}
   */
  getRoutes() {
    return _routes.concat(this.pluginRoutes)
  }

  onNavigate(hash = "login", data = {}) {
    if (this.wallet.isLocked())
      hash = "login"

    const routes = this.getRoutes()
    let match = routes.find(potentialMatch => {
      return hash === potentialMatch.hash
    });

    /* Route not found - return first route OR a specific "not-found" route */
    if (!match) {
      match = routes[0];
    }

    return this.updateView(match, data)
  }

  async updateView(match, data = {}) {
    this.currentView = new match.view(this, this.wallet, data);
    this.appContainer.innerHTML = await this.currentView.getHtml();

    await this.currentView.onMounted(this.appContainer);
  }


  async refresh() {
    await this.currentView.onDismount()
    this.appContainer.innerHTML = await this.currentView.getHtml();
    await this.currentView.onMounted(this.appContainer);
  }

  bind(document) {

    this.appContainer = document.querySelector("#app")

    document.body.addEventListener("click", e => {

      if (e.target.matches('[target="_blank"]')) {
        console.log("External link", e.target.props.href)
        return
      }

      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.dataset.link);
      }
    });
  }
}
