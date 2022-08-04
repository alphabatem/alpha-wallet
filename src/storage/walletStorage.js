import {StorageDriver} from "./storageDriver";
import CryptoJS from "crypto-js/aes"

export class WalletStorage extends StorageDriver {

  passcode = null;

  constructor(passcode) {
    super()
    this.passcode = passcode
  }


  async getWalletAddr() {
    const inp = this.getLocal("wallet_addr")
    return CryptoJS.AES.decrypt(inp, this.passcode)
  }

  async setWalletAddr(walletAddr) {
    const out = CryptoJS.AES.encrypt(walletAddr, this.passcode);
    return this.setLocal("wallet_addr", out)
  }

}
