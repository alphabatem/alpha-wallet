import {web3} from "@project-serum/anchor";

class AlphaConnector {
  isConnected = false

  isMetaMask = false
  isAlpha = true
  isAlphaWallet = true

  channel = null

  publicKey

  constructor() {
    window.addEventListener("message", (e) => {
      this.onMessage(e)
    })
  }

  onMessage(e) {
    if (e.data.type && e.data.type === "alpha_msg_resp") {
      this.channel.port2.postMessage(e.data)
    }
  }

  sendMessage(method, data) {
    return new Promise((res, rej) => {
      this.channel = new MessageChannel();
      this.channel.port1.onmessage = ({data}) => {
        if (data.type && data.type === "alpha_msg_resp") {
          let response = null

          console.log("inject Response", data)
          //TODO move to outside this function
          switch (data.method) {
            case "connect":
              this.isConnected = true;
              this.publicKey = new web3.PublicKey(data.payload)
              break
            case "signMessage":
              const signatureArray = []
              const keys = Object.keys(data.payload)

              for (let i = 0; i < keys.length; i++) {
                signatureArray.push(data.payload[keys[i]])
              }

              response = {
                signature: {
                  data: signatureArray,
                  type: "Buffer"
                },
              }
              break
          }

          // this.channel.port1.close();
          this.channel = null //Clear channel
          if (data.error) {
            rej(data.error);
          } else {
            res(response);
          }
        }
      };

      window.postMessage({
        type: "alpha_msg",
        method: method,
        payload: data
      })
    })
  }

  async request(req) {
    return this.sendMessage(req.method, req.params)
  }

  async connect(params = {onlyIfTrusted: false}) {
    //
    return this.sendMessage("connect", {onlyIfTrusted: !!params.onlyIfTrusted})
  }

  async disconnect() {
    return this.sendMessage("disconnect")
  }

  async signAndSendTransaction(txn, sendOptions) {
    return this.sendMessage("signAndSendTransaction", {
      transaction: txn,
      opts: sendOptions
    })
  }

  async signTransaction(txn) {
    return this.sendMessage("signTransaction", {
      transaction: txn
    })
  }

  async signAllTransactions(txns) {
    return this.sendMessage("signAllTransactions", {
      transactions: txns
    })
  }

  async signMessage(msg) {
    const smsg = new TextDecoder().decode(msg)
    console.log("Signing message", smsg)
    return this.sendMessage("signMessage", {
      message: smsg
    })
  }

  on(event) {
    console.log("Registering event: ", event)
  }

  off(event) {
    console.log("Deregistering event: ", event)
  }
}

window.alpha = new AlphaConnector()
