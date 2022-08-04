import {Manager} from "./manager";

export class NFTManager extends Manager {

  tokens = {}


  id() {
    return NFT_MGR
  }
}

const NFT_MGR = "nft_manager"
