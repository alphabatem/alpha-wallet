import AbstractView from "../../view.js";

export class NamespaceCard extends AbstractView {
  async getHtml() {
    const ns = this._data.namespace

    return `<div class="card ns-card" data-namespace="${ns.key}">
	<div class="card-body ns-card-body p-5">
        <h3>${ns.name || ns.key}</h3>
        <code class="xsmall">${ns.key}</code>
	</div>
</div>`
  }
}
