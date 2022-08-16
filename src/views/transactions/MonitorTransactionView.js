import AbstractView from "../../view";

export class MonitorTransactionView extends AbstractView {

  async getHtml() {
    this.setTitle("Sending")

    console.log("TXN", this._data.txn)


    //TODO Send multiple tokens

    //TODO Get recipient


    return `<h1>${this.title}</h1>

    ${JSON.stringify(this._data.txn)}
    `;
  }

}
