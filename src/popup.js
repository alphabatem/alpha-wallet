'use strict';

import './popup.css';
import './base.css';
import {Router} from "./router";
import {AlphaWallet} from "./wallet/alphaWallet";

(function () {
  const wallet = new AlphaWallet()
  const router = new Router(wallet)

  function beforeMount() {
    router.bind(document)

    mounted() //Call next step
  }

  function mounted() {
    // Restore count value
    // counterStorage.get((count) => {
    //   if (typeof count === 'undefined') {
    //     // Set counter value as 0
    //     counterStorage.set(0, () => {
    //       setupCounter(0);
    //     });
    //   } else {
    //     setupCounter(count);
    //   }
    // });

    router.onNavigate()
  }

  document.addEventListener('DOMContentLoaded', beforeMount);
})();
