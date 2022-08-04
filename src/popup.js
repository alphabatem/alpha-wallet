'use strict';

import './popup.css';
import './base.css';
import {Router} from "./router";

(function () {
  const router = new Router()

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
    console.log("Router bound")
  }

  document.addEventListener('DOMContentLoaded', beforeMount);
})();
