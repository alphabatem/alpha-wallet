'use strict';

function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  if (!node) {
    console.error("Invalid node", tag)
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


/**
 * TODO Add promise here to return & satisfy it in `onMessageResponse`
 * @param e
 */
function onMessage(e) {
  if (e.data.type && e.data.type === "alpha_msg") {
    console.log("Sending", e.data.method, e.data)
    chrome.runtime.sendMessage({
      method: e.data.method,
      data: e.data.payload
    }, onMessageResponse)
  }
}

/**
 * Called upon completion of message
 * @param r
 */
function onMessageResponse(r) {
  console.log('onMessageResponse', r)

  if (!r)
    return
  console.log("Message response", r)

  switch (r) {
    case "must_auth":
      console.warn("must_auth")
      return;
  }
  console.log("Response", r)
  window.postMessage({type: "alpha_msg_resp", method: r.method, payload: r.data})
}
