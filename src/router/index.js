import TokenView from "../views/TokenView.js";
import NFTView from "../views/NFTView.js";
import TransferView from "../views/TransferView.js";
import SettingsView from "../views/SettingsView.js";

const routes = [
  {hash: "tokens", view: TokenView},
  {hash: "nft", view: NFTView},
  {hash: "transfer", view: TransferView},
  {hash: "settings", view: SettingsView}
]

export class Router {

  appContainer

  navigateTo = hash => {
    history.pushState(null, null, hash);
    this.onNavigate(hash);
  };

  onNavigate(hash = "tokens") {
    console.log("onNavigate", hash)
    let match = routes.find(potentialMatch => {
      return hash.match(potentialMatch.hash)
    });
    console.log("Match", match)

    /* Route not found - return first route OR a specific "not-found" route */
    if (!match) {
      match = routes[0];
    }

    return this.updateView(match)
  }

  async updateView(match) {
    console.log("Updating view", match)
    const view = new match.view();
    this.appContainer.innerHTML = await view.getHtml();
  }

  bind(document) {

    this.appContainer = document.querySelector("#app")

    document.body.addEventListener("click", e => {
      console.log("bclick", e, e.target)
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.dataset.link);
      }
    });
  }
}
