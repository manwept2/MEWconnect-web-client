import createLogger from 'logging'

import io from 'socket.io-client'
import SimplePeer from 'simple-peer'
import MewConnectCommon from './MewConnectCommon'
import MewConnectCrypto from './MewConnectCrypto'

const logger = createLogger('MewConnectInitiator')

/**
 *  Primary Web end of a MEW Connect communication channel
 *  Handles the initial actions to setup said connection
 */
class MewConnectInitiator extends MewConnectCommon {
  /**
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  constructor(uiCommunicatorFunc = null, loggingFunc, additionalLibs) {
    super(uiCommunicatorFunc, loggingFunc)
    // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists
    if (this.isBrowser) {
      // eslint-disable-next-line no-undef
      window.onunload = window.onbeforeunload = () => {
        if (!!this.Peer && !this.Peer.destroyed) {
          this.rtcDestroy()
        }
      }
    }
    this.p = null
    this.qrCodeString = null
    this.socketConnected = false
    this.connected = false

    this.io = additionalLibs.io || io

    this.signals = this.jsonDetails.signals
    this.rtcEvents = this.jsonDetails.rtc
    this.version = this.jsonDetails.version
    this.versions = this.jsonDetails.versions
    this.lifeCycle = this.jsonDetails.lifeCycle

    // Library used to facilitate the WebRTC connection and subsequent communications
    this.Peer = additionalLibs.wrtc || SimplePeer

    // Initial (STUN) server set used to initiate a WebRTC connection
    this.stunServers = this.jsonDetails.stunSrvers

    // Initialization of the array to hold the TURN server
    // information if the initial connection attempt fails
    this.turnServers = []

    // Object with specific methods used in relation to cryptographic operations
    this.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create()
  }

  /**
   * Factory function
   */
  static init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    return new MewConnectInitiator(
      uiCommunicatorFunc,
      loggingFunc,
      additionalLibs
    )
  }

  /**
   * Returns a boolean indicating whether the socket connection exists and is active
   */
  getSocketConnectionState() {
    return this.socketConnected
  }

  /**
   * Returns a boolean indicating whether the WebRTC connection exists and is active
   */
  getConnectonState() {
    return this.connected
  }

  /**
   * Emit/Provide the details used in creating the QR Code
   */
  displayCode(data) {
    this.logger('handshake', data)
    this.socketKey = data
    const separator = this.jsonDetails.connectionCodeSeparator
    const qrCodeString =
      this.version + separator + data + separator + this.connId
    this.qrCodeString = qrCodeString
    this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString)
    this.uiCommunicator(this.lifeCycle.checkNumber, data)
    this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId)
  }

  // ////////////// Initialize Communication Process //////////////////////////////

  /**
   * The initial method called to initiate the exchange that can create a WebRTC connection
   */
  async initiatorStart(url) {
    this.keys = this.mewCrypto.prepareKey()
    const toSign = this.mewCrypto.generateMessage()
    this.signed = await this.mewCrypto.signMessage(
      this.keys.pvt.toString('hex')
    )
    this.connId = this.mewCrypto.bufferToConnId(this.keys.pub)
    this.displayCode(this.keys.pvt.toString('hex'))
    this.uiCommunicator(this.lifeCycle.signatureCheck, this.signed)
    const options = {
      query: {
        stage: 'initiator',
        signed: this.signed,
        message: toSign,
        connId: this.connId
      },
      transports: ['websocket', 'polling', 'flashsocket'],
      secure: true
    }
    this.socketManager = this.io(url, options)
    this.socket = this.socketManager.connect()
    this.initiatorConnect(this.socket)
  }

  // ////////////// WebSocket Communication Methods and Handlers //////////////////////////////

  /**
   * Setup message handlers for communication with the signal server
   */
  initiatorConnect(socket) {
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent)

    this.socket.on(this.signals.connect, () => {
      this.socketConnected = true
      this.applyDatahandlers(
        JSON.stringify({ type: 'socketConnected', data: null })
      )
    })
    // A connection pair exists, create and send WebRTC OFFER
    this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)) // response
    // Handle the WebRTC ANSWER from the opposite (mobile) peer
    this.socketOn(this.signals.answer, this.recieveAnswer.bind(this))
    // Handle Failure due to an attempt to join a connection with two existing endpoints
    this.socketOn(this.signals.confirmationFailedBusy, () => {
      this.uiCommunicator(this.lifeCycle.confirmationFailedBusyEvent)
      this.logger('confirmation Failed: Busy')
    })
    // Handle Failure due to the handshake/ verify details being invalid for the connection ID
    this.socketOn(this.signals.confirmationFailed, () => {
      this.uiCommunicator(this.lifeCycle.confirmationFailedEvent)
      this.logger('confirmation Failed: invalid confirmation')
    })
    // Handle Failure due to no opposing peer existing
    this.socketOn(this.signals.invalidConnection, () => {
      this.uiCommunicator(this.lifeCycle.invalidConnectionEvent) // should be different error message
      this.logger('confirmation Failed: no opposite peer found')
    })
    // Handle Socket Disconnect Event
    this.socketOn(this.signals.disconnect, reason => {
      this.logger(reason)
      this.socketConnected = false
    })
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used
    this.socketOn(this.signals.attemptingTurn, () => {
      this.logger('TRY TURN CONNECTION') // todo remove dev item
    })
    // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
    this.socketOn(this.signals.turnToken, data => {
      this.retryViaTurn(data)
    })

    return socket
  }

  // Wrapper around socket.emit method
  socketEmit(signal, data) {
    this.socket.binary(false).emit(signal, data)
  }

  // Wrapper around socket.disconnect method
  socketDisconnect() {
    this.socket.disconnect()
  }

  // Wrapper around socket.on listener registration method
  socketOn(signal, func) {
    this.socket.on(signal, func)
  }

  // /////////////////////////////////////////////////////////////////////////////////////////////

  // //////////////////////// WebRTC Communication Related ///////////////////////////////////////

  // ////////////// WebRTC Communication Setup Methods ///////////////////////////////////////////

  /**
   *  Initial Step in beginning the webRTC setup
   */
  async sendOffer(data) {
    const plainTextVersion = await this.mewCrypto.decrypt(data.version)
    this.peerVersion = plainTextVersion
    this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion)

    this.logger('sendOffer', data)
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: this.stunServers
      }
    }
    this.initiatorStartRTC(this.socket, options)
  }

  /**
   * creates the WebRTC OFFER.  encrypts the OFFER, and
   * emits it along with the connection ID and STUN/TURN details to the signal server
   */

  initiatorSignalListener(socket, options) {
    return async data => {
      try {
        this.logger('SIGNAL', JSON.stringify(data))
        const encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(data))
        this.socketEmit(this.signals.offerSignal, {
          data: encryptedSend,
          connId: this.connId,
          options: options.servers
        })
      } catch (e) {
        logger.error(e)
      }
    }
  }

  async recieveAnswer(data) {
    try {
      const plainTextOffer = await this.mewCrypto.decrypt(data.data)
      this.rtcRecieveAnswer({ data: plainTextOffer })
    } catch (e) {
      logger.error(e)
    }
  }

  rtcRecieveAnswer(data) {
    this.p.signal(JSON.parse(data.data))
  }

  /**
   * Initiates one side (initial peer) of the WebRTC connection
   */
  initiatorStartRTC(socket, options) {
    const webRtcConfig = options.webRtcConfig || {}
    const signalListener = this.initiatorSignalListener(
      socket,
      webRtcConfig.servers
    )
    const webRtcServers = webRtcConfig.servers || this.stunServers

    const suppliedOptions = options.webRtcOptions || {}
    const defaultOptions = {
      initiator: true,
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: webRtcServers
      }
    }

    const simpleOptions = {
      ...defaultOptions,
      suppliedOptions
    }

    this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent)
    this.p = new this.Peer(simpleOptions)
    this.p.on(this.rtcEvents.error, this.onError.bind(this))
    this.p.on(this.rtcEvents.connect, this.onConnect.bind(this))
    this.p.on(this.rtcEvents.close, this.onClose.bind(this))
    this.p.on(this.rtcEvents.data, this.onData.bind(this))
    this.p.on(this.rtcEvents.signal, signalListener.bind(this))
    this.logger('simple peer', this.p)
  }

  // ////////////// WebRTC Communication Event Handlers //////////////////////////////

  /**
   * Emitted when the  webRTC connection is established
   */
  onConnect() {
    this.logger('CONNECT', 'ok')
    this.connected = true
    this.socketEmit(this.signals.rtcConnected, this.socketKey)
    this.socketDisconnect()
    setTimeout(() => {
      this.uiCommunicator(this.lifeCycle.RtcConnectedEvent)
      this.applyDatahandlers(
        JSON.stringify({ type: 'rtcConnected', data: null })
      )
    }, 100)
  }

  /**
   * Emitted when the data is received via the webRTC connection
   */
  async onData(data) {
    this.logger('DATA RECEIVED', data.toString())
    try {
      let decryptedData
      if (this.isJSON(data)) {
        decryptedData = await this.mewCrypto.decrypt(
          JSON.parse(data.toString())
        )
      } else {
        decryptedData = await this.mewCrypto.decrypt(
          JSON.parse(data.toString())
        )
      }
      if (this.isJSON(decryptedData)) {
        const parsed = JSON.parse(decryptedData)
        this.logger('DECRYPTED DATA RECEIVED', parsed)
        this.emit(parsed.type, parsed.data)
      } else {
        this.logger('DECRYPTED DATA RECEIVED', decryptedData)
        this.emit(decryptedData.type, decryptedData.data)
      }
    } catch (e) {
      logger.error(e)
      this.logger('peer2 ERROR: data=', data)
      this.logger('peer2 ERROR: data.toString()=', data.toString())
    }
  }

  /**
   * Emitted when one end of the webRTC connection closes
   */
  onClose(data) {
    this.logger('WRTC CLOSE')
    this.connected = false
    this.uiCommunicator(this.lifeCycle.RtcClosedEvent, data)
  }

  /**
   * Emitted when there is an error with the webRTC connection
   */
  onError(err) {
    logger.error('WRTC ERROR')
    this.logger('error', err)
    this.uiCommunicator(this.lifeCycle.RtcErrorEvent, err)
  }

  // /////////////////////// WebRTC Communication Methods /////////////////////////////////////////
  /**
   * sends a hardcoded message through the rtc connection
   */
  testRTC(msg) {
    return () => {
      this.rtcSend(JSON.stringify({ type: 2, text: msg }))
    }
  }

  /**
   * prepare a message to send through the rtc connection. using a closure to
   * hold off calling the rtc object until after it is created
   */
  sendRtcMessageClosure(type, msg) {
    return () => {
      this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg)
      this.rtcSend(JSON.stringify({ type, data: msg }))
    }
  }

  /**
   * prepare a message to send through the rtc connection
   */
  sendRtcMessage(type, msg) {
    this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg)
    this.rtcSend(JSON.stringify({ type, data: msg }))
  }

  /**
   * Disconnect the current RTC connection
   */
  disconnectRTCClosure() {
    return () => {
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent)
      this.applyDatahandlers(
        JSON.stringify({ type: 'rtcDisconnect', data: null })
      )
      this.rtcDestroy()
      this.instance = null
    }
  }

  /**
   * Disconnect the current RTC connection, and call any clean up methods
   */
  disconnectRTC() {
    this.rtcDestroy()
    this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent)
    this.applyDatahandlers(
      JSON.stringify({ type: 'rtcDisconnect', data: null })
    )
    this.instance = null
  }

  /**
   * send a message through the rtc connection
   */
  async rtcSend(arg) {
    let encryptedSend
    if (typeof arg === 'string') {
      encryptedSend = await this.mewCrypto.encrypt(arg)
    } else {
      encryptedSend = await this.mewCrypto.encrypt(JSON.stringify(arg))
    }
    this.p.send(JSON.stringify(encryptedSend))
  }

  /**
   * Disconnect/Destroy the current RTC connection
   */
  rtcDestroy() {
    if (this.p !== null) {
      this.p.destroy()
    }
  }

  // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////
  /**
   * Fallback Step if initial webRTC connection attempt fails.
   * Retries setting up the WebRTC connection using TURN
   */
  retryViaTurn(data) {
    const options = {
      signalListener: this.initiatorSignalListener,
      webRtcConfig: {
        servers: data.data
      }
    }
    this.initiatorStartRTC(this.socket, options)
  }
}

export default MewConnectInitiator
