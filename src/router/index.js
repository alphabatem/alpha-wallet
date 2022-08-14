import TokenView from "../views/TokenView.js";
import NFTView from "../views/NFTView.js";
import SettingsView from "../views/SettingsView.js";
import LanguageView from "../views/settings/LanguageView";
import TrustedSitesView from "../views/settings/TrustedSitesView";
import RPCSelectView from "../views/settings/RPCSelectView";
import LockTimeoutView from "../views/settings/LockTimeoutView";
import DefaultExplorerView from "../views/settings/DefaultExplorerView";
import PluginSettingsView from "../views/settings/PluginsView";
import LoginPasscodeView from "../views/auth/LoginView";
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
import RemoveWalletView from "../views/creation/RemoveWalletView";
import CustomRPCView from "../views/settings/CustomRPCView";
import ApproveTrustedSiteView from "../views/approval/ApproveTrustedSiteView";
import ApproveTxnView from "../views/approval/ApproveTxnView";
import SetPinCodeView from "../views/SetPinCodeView";
import LoginPinCodeView from "../views/auth/LoginPinCodeView";
import CreditsView from "../views/settings/CreditsView";
import ApproveMessageView from "../views/approval/ApproveMessageView";

const _routes = [
  {hash: "login", view: LoginPasscodeView},
  {hash: "login_pin", view: LoginPinCodeView},

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
  {hash: "wallets/set_pin", view: SetPinCodeView},

  {hash: "wallets/add", view: AddWalletView},
  {hash: "wallets/create", view: WalletCreateView},
  {hash: "wallets/create/save", view: WalletCreateSaveView},
  {hash: "wallets/remove", view: RemoveWalletView},
  {hash: "wallets/import", view: WalletImportView},
  {hash: "wallets/connect", view: ComingSoonView},

  //Used to set wallet_addr prior to wallet creation implemented
  {hash: "settings/wallet_name", view: WalletNameView},

  {hash: "auth/trusted_site", view: ApproveTrustedSiteView},
  {hash: "auth/approve_txn", view: ApproveTxnView},
  {hash: "auth/approve_msg", view: ApproveMessageView},

  {hash: "settings/trusted_apps", view: TrustedSitesView},
  {hash: "settings/language", view: LanguageView},
  {hash: "settings/rpc", view: RPCSelectView},
  {hash: "settings/rpc/custom", view: CustomRPCView},
  {hash: "settings/lock_timeout", view: LockTimeoutView},
  {hash: "settings/default_explorer", view: DefaultExplorerView},
  {hash: "settings/plugins", view: PluginSettingsView},
  {hash: "settings/credits", view: CreditsView},
]

export class Router {

  appContainer

  wallet

  currentView

  pluginRoutes = [];

  currentRoute = null
  lastRoute = null

  constructor(wallet) {
    this.wallet = wallet
  }

  back() {
    if (!this.lastRoute)
      return

    return this.navigateTo(this.lastRoute.hash, this.lastRoute.data)
  }

  navigateTo(hash, data = {}) {
    this.lastRoute = this.currentRoute
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

  async onNavigate(hash = "login_pin", data = {}) {
    if (this.wallet.isLocked()) {
      if (hash !== "login" && hash !== "login_pin")
        data.redirect_to = hash

      if (await this.wallet.isPinCodeSet() && hash !== "login") {
        hash = "login_pin"
      } else {
        hash = "login"
      }
      console.log("Wallet locked, redirecting", hash)
    }

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
    this.currentRoute = {hash: match.hash, data: data}
    this.currentView = new match.view(this, this.wallet, data);

    if (!await this.currentView.beforeMount())
      return //View updated dont proceed

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
        return
      }

      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.dataset.link);
      }
    });
  }
}
