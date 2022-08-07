import {AbstractManager} from "../abstractManager";

export class WalletManager extends AbstractManager {


  id() {
    return WALLET_MGR
  }


}

export const WALLET_MGR = "wallet_mgr"
