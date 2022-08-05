import AbstractView from "../view.js";

export default class ApprovalView extends AbstractView {

  async getHtml() {
    this.setTitle("Approval");

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

  async onDismount() {
    document.getElementById("approve").removeEventListener("click", this.onApprove)
    document.getElementById("reject").removeEventListener("click", this.onReject)
  }
}
