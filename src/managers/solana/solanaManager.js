import {Manager} from "../manager";
import {SolanaRPC} from "../../chains/solanaRpc";

export class SolanaManager extends Manager {

  _rpc

  constructor(ctx, store) {
    super(ctx, store);

    //Get config & load rpc settings
    this.store.getConfig().then(cfg => {
      this._rpc = new SolanaRPC(cfg.rpcUrl, cfg.commitment)
    }).catch(e => {
      console.error("getConfig err", e)
    })
  }

  id() {
    return SOLANA_MANAGER
  }

  rpc() {
    return this._rpc
  }


}

export const SOLANA_MANAGER = "solana_mgr"
