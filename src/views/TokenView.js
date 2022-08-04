import AbstractView from "./view.js";

export default class TokenView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Tokens");
  }

  async getHtml() {
    return `
    <h5 class="text-start mb-3">Welcome Back, Cloakd</h5>

    <h1>$0,000.00</h1>
    <h3>-$999.99</h3>

    <div class="row mt-3">
      <div class="col-6">
        <button class="btn btn-primary btn-block">Deposit</button>
      </div>
      <div class="col-6">
        <button class="btn btn-primary btn-block">Send</button>
      </div>
    </div>

    <div class="token-container mt-3">
      <i class="small">No Token Assets Detected</i>
    </div>`;
  }
}
