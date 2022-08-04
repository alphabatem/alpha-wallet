import AbstractView from "../view.js";

export default class ApprovalView extends AbstractView {
  constructor(router, wallet) {
    super(router, wallet);
    this.setTitle("Approval");
  }

  async getHtml() {
    return ``;
  }


  onApprove(e) {
    console.log("Approved", e)
  }

  onReject(e) {
    console.log("Rejected", e)
  }

  async onMounted() {
    document.getElementById("approve").addEventListener("click", this.onApprove)
    document.getElementById("reject").addEventListener("click", this.onReject)
  }
}
