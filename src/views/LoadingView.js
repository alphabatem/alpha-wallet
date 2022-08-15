import AbstractView from "../view";

export class LoadingView extends AbstractView {
  async getHtml() {
    return `<div id="loading mt-5"><div class="container-fluid pt-5">
<div>
<div class="loading-icon mt-5">
<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
</div>
<h5>Loading</h5>
</div>
</div></div>`
  }
}
