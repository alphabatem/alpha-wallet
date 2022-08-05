'use strict';

import './popup.css';
import './base.css';
import {Router} from "./router";
import {AlphaWallet} from "./wallet/alphaWallet";

(function () {
  const wallet = new AlphaWallet()
  const router = new Router(wallet)


  function setupHeader() {
    // const walletName = document.getElementById("wallet_name")
    const walletAddr = document.getElementById("wallet_addr")
    const walletSwapper = document.getElementById("wallet_swap")
    const connectionStatus = document.getElementById("connection_status")

    walletSwapper.addEventListener("click", (e) => {
      router.navigateTo("wallets/swap")
    })

    document.addEventListener("unlock", (e) => {
      console.log("Wallet unlocked", e.detail)

      const addr = e.detail.wallet_addr

      connectionStatus.innerText = "Unlocked"
      // walletName.innerText = e.detail.wallet_name
      walletAddr.innerText = `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`

    })
  }

  function beforeMount() {
    setupHeader()

    router.bind(document)

    mounted() //Call next step
  }

  function mounted() {
    router.onNavigate()
  }

  document.addEventListener('DOMContentLoaded', beforeMount);
})();
