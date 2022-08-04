import TokenView from "../views/TokenView.js";
import NFTView from "../views/NFTView.js";
import TransferView from "../views/TransferView.js";
import SettingsView from "../views/SettingsView.js";
import LanguageView from "../views/settings/LanguageView";
import TrustedAppsView from "../views/settings/TrustedAppsView";
import RPCSelectView from "../views/settings/RPCSelectView";
import LockTimeoutView from "../views/settings/LockTimeoutView";
import DefaultExplorerView from "../views/settings/DefaultExplorerView";
import PluginsView from "../views/settings/PluginsView";
import LoginView from "../views/LoginView";
import SetPasscodeView from "../views/SetPasscodeView";
import WalletNameView from "../views/settings/WalletNameView";

const routes = [
  {hash: "login", view: LoginView},
  {hash: "tokens", view: TokenView},
  {hash: "nft", view: NFTView},
  {hash: "transfer", view: TransferView},
  {hash: "settings", view: SettingsView},
  {hash: "set_passcode", view: SetPasscodeView},

  //Used to set wallet_addr prior to wallet creation implemented
  {hash: "settings/wallet_name", view: WalletNameView},

  {hash: "settings/trusted_apps", view: TrustedAppsView},
  {hash: "settings/language", view: LanguageView},
  {hash: "settings/rpc", view: RPCSelectView},
  {hash: "settings/lock_timeout", view: LockTimeoutView},
  {hash: "settings/default_explorer", view: DefaultExplorerView},
  {hash: "settings/plugins", view: PluginsView},
]

export class Router {

  appContainer

  wallet

  currentView

  constructor(wallet) {
    this.wallet = wallet
  }

  navigateTo = hash => {
    history.pushState(null, null, hash);
    return this.onNavigate(hash);
  };

  onNavigate(hash = "login") {
    if (this.wallet.isLocked())
      hash = "login"

    let match = routes.find(potentialMatch => {
      return hash === potentialMatch.hash
    });

    /* Route not found - return first route OR a specific "not-found" route */
    if (!match) {
      match = routes[0];
    }

    return this.updateView(match)
  }

  async updateView(match) {
    this.currentView = new match.view(this, this.wallet);
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
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.dataset.link);
      }
    });
  }
}
