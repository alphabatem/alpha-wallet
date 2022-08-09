'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

import {AlphaWallet} from "./wallet/alphaWallet";
import {TRUSTED_SITE_MGR} from "./managers/core/trustedSites";

const alphaWallet = new AlphaWallet()

let currentWidth = 0
chrome.windows.getCurrent().then(t => {
  currentWidth = t.width
})

chrome.windows.onFocusChanged.addListener(() => {
  chrome.windows.getCurrent().then(t => {
    currentWidth = t.width
  })
})


chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log("Change", areaName, changes)
  })


chrome.alarms.onAlarm.addListener((a) => {
  switch (a.name) {
    case "pin-clear":
      alphaWallet.lock()
      break
  }
})

chrome.alarms.create("pin-clear", {delayInMinutes: 20})

console.log("BG Script running")
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("MSG: ", request)
  console.log("Sender: ", sender)

  if (!isTrustedSite(sender.origin)) {
    openPopup(`trusted_site.html?uri=${sender.origin}`)
    return sendResponse("must_auth")
  }


  alphaWallet.onMessage(request, sender).then(r => sendResponse(r))
  return true
});


function isTrustedSite(origin) {
  const tsm = alphaWallet.getManager(TRUSTED_SITE_MGR)
  if (!tsm) {
    console.warn("Trusted site manager plugin not installed")
    return false
  }

  return tsm.isTrusted(origin)
}


function openPopup(view) {
  chrome.windows.create({
    focused: true,
    type: "popup",
    url: view,
    width: 350,
    height: 500,
    top: 70,
    left: currentWidth,
  })
}
