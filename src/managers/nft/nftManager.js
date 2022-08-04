import {Manager} from "../manager";
import axios from "axios";

export class NFTManager extends Manager {

  _tokens = {
    staked: {},
    listed: {},
    liquid: {},
  }

  id() {
    return NFT_MGR
  }

  getMetadataFile(file) {
    return axios.get(file)
  }

  getLiquid() {

  }



}

export const NFT_MGR = "nft_manager"
