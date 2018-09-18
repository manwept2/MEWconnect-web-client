class MewConnectEth {
  constructor(callback) {
    this.listeners = []
    if (callback) {
      this.callback = callback
    }
    this.walletCallback = null
    this.signalerUrl = ''
  }

  getCallback() {
    return this.callback
  }

  setMewConnect(mewConnect) {
    this.comm = mewConnect
  }

  signalerConnect(url) {
    if (!url) {
      this.comm.initiatorStart(this.signalerUrl)
    } else {
      this.comm.initiatorStart(url)
    }
  }

  setWalletCallback(func) {
    this.walletCallback = func
  }

  signMessageSend(msg) {
    this.comm.sendRtcMessageDirect('sign', msg)
  }

  getPublic(path, callback) {
    const self = this
    self.comm.sendRtcMessage('publicKey', '')
    self.comm.use((data, next) => {
      if (data.type === 'publicKey') {
        callback('publicKey', data.data)
      } else {
        next()
      }
    })
  }

  signTransaction(eTx, rawTx) {
    this.comm.sendRtcMessageDirect('signTx', JSON.stringify(rawTx))
  }

  signMessage(messageHex) {
    this.comm.sendRtcMessageDirect('signMessage', messageHex)
  }
}
export default MewConnectEth
