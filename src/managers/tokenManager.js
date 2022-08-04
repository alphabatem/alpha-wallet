import {Manager} from "./manager";

export class TokenManager extends Manager {

  tokens = {}

  balance = 0


  id() {
    return TOKEN_MGR
  }
}

const TOKEN_MGR = "token_manager"
