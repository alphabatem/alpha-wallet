'use strict';

//TODO Evaluate if page is on our whitelist

function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  if (!node) {
    throw new Error("invalid node")
  }

  const script = document.createElement('script')
  script.setAttribute('type', "text/javascript")
  script.setAttribute('src', file_path)
  node.appendChild(script)
}

injectScript(chrome.runtime.getURL('injectScript.js'), "body")
//


window.addEventListener("message", onMessage)
window.addEventListener("beforeunload", (e) => {
  window.removeEventListener("message", onMessage)
})


function onMessage(e) {
  if (e.data.type && e.data.type === "alpha_msg") {
    console.log("Sending", e.data.method)
    chrome.runtime.sendMessage({
      method: e.data.method,
      data: e.data.payload
    }, onMessageResponse)
  }
}

function onMessageResponse(r) {
  if (!r)
    return
  console.log("Message response", r)

  switch (r) {
    case "must_auth":
      return;
  }
}
