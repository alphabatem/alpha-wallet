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


window.addEventListener("message", (e) => {
  if (e.data.type && e.data.type === "FROM_PAGE") {
    chrome.runtime.sendMessage({
      method: e.data.method,
      data: e.data.payload
    })
  }
})
