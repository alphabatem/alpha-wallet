import AbstractView from "../../view";

export class TrustedSiteCard extends AbstractView {

  async getHtml() {
    const site = this._data.site

    return `<div class="card ns-card" data-namespace="${site.uri}">
	<div class="card-body ns-card-body p-3">
        <h4>${site.uri}</h4>
	</div>
</div>`
  }
}
