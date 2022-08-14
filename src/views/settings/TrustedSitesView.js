import AbstractView from "../../view.js";
import {TRUSTED_SITE_MGR} from "../../managers/core/trustedSites";
import {TrustedSiteCard} from "../../components/settings/TrustedSiteCard";
import {NS_MANAGER} from "../../managers/core/namespaceManager";

export default class TrustedSitesView extends AbstractView {

  async getHtml() {
    this.setTitle("Trusted Sites");

    const mgr = this.getManager(TRUSTED_SITE_MGR)
    if (!mgr)
      return `` //Plugin not enabled

    const sites = await mgr.getTrustedSites()
    const siteUris = Object.keys(sites)
    console.log("Trusted sites", sites)

    let siteDom = ``
    for (let i = 0; i < siteUris.length; i++) {
      const s = {...sites[siteUris[i]], uri: siteUris[i]}
      siteDom += await this.addSubView(TrustedSiteCard, {site: s}).getHtml()
    }

    return `
            <h1>${this.title}</h1>

            <div class="row mt-1">
            ${siteDom}
	</div>
        `;
  }

  async beforeMount() {
    const ns = this.getManager(NS_MANAGER).getActiveNamespace()
    if (!ns || ns === "_default") {
      this.getRouter().navigateTo("wallets/swap", {redirect_to: "settings/trusted_apps"})
      return false
    }
    return true
  }
}
