import {AbstractManager} from "../abstractManager";
import {SolanaRPC} from "../../chains/solanaRpc";
import {EVENT_MGR, EVENTS} from "../core/eventManager";

export class SolanaManager extends AbstractManager {

  _rpc

  configure(ctx) {
    super.configure(ctx);
    this.getManager(EVENT_MGR).subscribe(EVENTS.onConfig, (c) => this.onConfig(c))
  }

  id() {
    return SOLANA_MANAGER
  }

  rpc() {
    return this._rpc
  }

  onConfig(cfg) {
    console.log("Config loaded, starting RPC")
    this._rpc = new SolanaRPC(cfg.rpcUrl, cfg.commitment)
  }

}

export const SOLANA_MANAGER = "solana_mgr"
