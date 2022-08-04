'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

import {AlphaWallet} from "./wallet/alphaWallet";

const alphaWallet = new AlphaWallet()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("MSG: ", request)
  console.log("Sender: ", sender)
  alphaWallet.onMessage(request, sender, sendResponse)
});
