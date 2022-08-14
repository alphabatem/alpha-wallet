'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

import {AlphaWallet} from "./wallet/alphaWallet";
import {TRUSTED_SITE_MGR} from "./managers/core/trustedSites";
import {MESSAGE_MGR} from "./managers/browser_messages/messageManager";

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
  console.log("BG::onMessage: ", request, sender)

  //Internal Sender
  if (isInternalMessage(sender)) {
    handleInternalMessage(request, sender, sendResponse)
    return true
  }

  handleMessage(request, sender, sendResponse)
  return true
});


function isInternalMessage(sender) {
  return sender.id === chrome.runtime.id && sender.origin === `chrome-extension://${chrome.runtime.id}`
}

function handleInternalMessage(request, sender, sendResponse) {
  if (!isInternalMessage(sender)) return sendResponse(); //Double check

  console.log("Internal msg", request, sender)
  return alphaWallet.onMessage(request, sender).then(r => {
    sendResponse(r)
  })
}


function handleMessage(request, sender, sendResponse) {
  if (!isTrustedSite(sender.origin)) {
    openTrustedSiteApproval(sender)
    return sendResponse("must_auth")
  }

  //Trusted site

  if (request.method === "connect" || request.method === "disconnect") {
    return alphaWallet.onMessage(request, sender).then(r => {
      sendResponse(r)
    })
  }

  return openApprovalView(request,sender)
}

function isTrustedSite(origin) {
  const tsm = alphaWallet.getManager(TRUSTED_SITE_MGR)
  if (!tsm) {
    console.warn("Trusted site manager plugin not installed")
    return false
  }

  return tsm.isTrusted(origin)
}


function openTrustedSiteApproval(sender) {
  const tsm = alphaWallet.getManager(TRUSTED_SITE_MGR)
  tsm.setTrustedSiteRequest(sender.origin).then(() => {
    openPopup(`trusted_site.html`)
  })
}


function openApprovalView(request, sender) {
  const msgMgr = alphaWallet.getManager(MESSAGE_MGR)

  const req = {
    request: request,
    sender: sender
  }

  msgMgr.setRequest(req).then(() => {
    switch (request.method) {
      case "signMessage":
        return openPopup(`approve_msg.html`)
    }
    return openPopup(`approve_txn.html`)
  })

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
