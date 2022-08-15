import AbstractView from "../../view";
import {NFTCard} from "./NFTCard";

export class NFTSlider extends AbstractView {

  async getHtml() {
    const nftArr = this._data.tokens
    let nftView = ``;
    for (let i = 0; i < nftArr.length; i++) {
      const card = await this.addSubView(NFTCard, {
        token: {mint: nftArr[i]},
      }).getHtml()

      nftView += `<div>${card}</div>`
    }

    return `<div class="slider-container"><div style="width: ${nftArr.length * 160}px" class="slider-horizontal">${nftView}</div></div>`
  }
}
