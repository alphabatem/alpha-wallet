import AbstractView from "../../view";
import {STORAGE_MGR} from "../../managers/storage/storageManager";
import {MESSAGE_MGR} from "../../managers/browser_messages/messageManager";


export class ApprovalView extends AbstractView {

  checkInterval


  async getRequest() {
    const msgMgr = this.getManager(MESSAGE_MGR)
    if (!msgMgr)
      return ``

    return await msgMgr.getRequest()
  }

  onApprove(e) {
    clearInterval(this.checkInterval)
  }

  onReject(e) {
    clearInterval(this.checkInterval)
    window.close()
  }

  addProgressBar() {
    return `<div class="col-12"><div id="progress"></div></div>`
  }


  async checkTimeout() {
    const ks = await this.getManager(STORAGE_MGR).getKeyStore()
    if (!ks) {
      this.onReject("wallet timeout")
      return
    }

    const ttl = ks.getUnlockTimeLeft()
    if (ttl <= 0) {
      this.onReject("wallet timeout")
    }

  }


  /**
   * Notify bg script of response
   * @param data
   */
  notifyResponse(data) {
    chrome.runtime.sendMessage({type: "response", data: data})
  }

  startProgressBar(duration = 60) {
    this.progressBar = document.getElementById("progress")
    this.progressBar.style.transitionDuration = `${duration}s`

    //Trigger bar animation on next frame
    window.requestAnimationFrame(() => {
      this.progressBar.style.width = `0px`
    })
  }

  async onMounted(app) {
    super.onMounted(app);

    this.checkInterval = setInterval(() => {
      this.checkTimeout()
    }, 1000)

    this.startProgressBar(60)
  }

  async onDismount() {
    super.onDismount();


    clearInterval(this.checkInterval)
  }
}
