'use strict';

import {AlphaWallet} from "./wallet/alphaWallet";
import {TRUSTED_SITE_MGR} from "./managers/core/trustedSites";
import {MESSAGE_MGR} from "./managers/browser_messages/messageManager";

const alphaWallet = new AlphaWallet()

let pendingRequest = null

let currentWidth = 0
chrome.windows.getCurrent().then(t => {
  currentWidth = t.width
})

chrome.windows.onFocusChanged.addListener(() => {
  chrome.windows.getCurrent().then(t => {
    currentWidth = t.width
  })
})


chrome.storage.local.get(null, (r) => {
  // console.log("Storage Area", r)
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  // console.log("Change", areaName, changes)
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
  console.log("BG::onMessage: ", request)

  //Internal Sender
  if (isInternalMessage(sender)) {
    _handleInternalMessage(request, sender, sendResponse)
    return true
  }

  pendingRequest = {
    method: request.method,
    responder: sendResponse
  }
  _handleMessage(request, sender, sendResponse)
  return true
});


function isInternalMessage(sender) {
  return sender.id === chrome.runtime.id && sender.origin === `chrome-extension://${chrome.runtime.id}`
}

function _handleInternalMessage(request, sender, sendResponse) {
  console.log("_handleInternalMessage", request, sender)
  if (request.type === "response") {
    if (pendingRequest) {
      sendMethodResponse(pendingRequest.responder, pendingRequest.method, request.data)
    } else {
      console.debug("no pendingRequest, forwarding internal message")
      sendMethodResponse(sendResponse, request.type, request.data)
    }
  } else
    console.log("_handleInternalMessage::skipped - ", request.type)
}


function _handleMessage(request, sender, sendResponse) {
  console.log("handleMessage", request)
  isTrustedSite(sender.origin).then(ok => {
    if (!ok) {
      console.warn("Site is NOT trusted", sender)
      openTrustedSiteApproval(sender)
      return sendMethodResponse(sendResponse, request.method, "must_auth")
    }


    //Trusted site
    console.log("Site is trusted", sender)
    if (request.method === "connect" || request.method === "disconnect") {
      return alphaWallet.onMessage(request, sender).then(r => {
        console.log("Sending onMessage Response: ", r)
        sendMethodResponse(sendResponse, request.method, r)
      })
    }

    return openApprovalView(request, sender)
  })
}

async function isTrustedSite(origin) {
  const uri = new URL(origin)

  const tsm = alphaWallet.getManager(TRUSTED_SITE_MGR)
  if (!tsm) {
    console.warn("Trusted site manager plugin not installed")
    return false
  }

  return await tsm.isTrusted(uri.host)
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

function sendMethodResponse(channel, method, payload) {
  console.log("Sending response", method)
  channel({
    method: method,
    data: payload
  })
  pendingRequest = null
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
