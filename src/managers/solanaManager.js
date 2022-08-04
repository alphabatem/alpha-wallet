import {Manager} from "./manager";
import {SolanaRPC} from "../chains/solanaRpc";

export class SolanaManager extends Manager {

  _rpc

  solBalance = 0

  _tokens = {
    staked: {},
    liquid: {},
  }

  _nfts = {
    staked: {},
    listed: {},
    liquid: {},
  }

  constructor(ctx, store) {
    super(ctx, store);

    //Get config & load rpc settings
    this.store.getConfig().then(cfg => {
      this._rpc = new SolanaRPC(cfg.rpcUrl, cfg.commitment)
      this.onConnected()
    }).catch(e => {
      console.error("getConfig err", e)
    })
  }

  id() {
    return SOLANA_MANAGER
  }

  onConnected() {

  }


}

const SOLANA_MANAGER = "solana_mgr"
