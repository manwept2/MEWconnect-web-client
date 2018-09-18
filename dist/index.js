'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createLogger = _interopDefault(require('logging'));
var browserOrNode = require('browser-or-node');
var events = _interopDefault(require('events'));
var eccrypto = _interopDefault(require('eccrypto/browser'));
var ethUtils = _interopDefault(require('ethereumjs-util'));
var crypto = _interopDefault(require('crypto'));
var secp256k1 = _interopDefault(require('secp256k1'));
var Buffer = _interopDefault(require('buffer'));
var io = _interopDefault(require('socket.io-client'));
var SimplePeer = _interopDefault(require('simple-peer'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var version = "1.0.2";

var version$1 = version;
var stunServers = [{
  url: 'stun:global.stun.twilio.com:3478?transport=udp'
}];

var versions = ['0.0.1'];
var connectionCodeSchemas = {
  '0.0.1': ['version', 'key', 'connId']
};
var connectionCodeSeparator = '_';
var signal = {
  attemptingTurn: 'attemptingTurn',
  turnToken: 'turnToken',
  tryTurn: 'tryTurn',
  connection: 'connection',
  connect: 'connect',
  signature: 'signature',
  offerSignal: 'offerSignal',
  offer: 'offer',
  answerSignal: 'answerSignal',
  answer: 'answer',
  rtcConnected: 'rtcConnected',
  disconnect: 'disconnect',
  handshake: 'handshake',
  confirmation: 'confirmation',
  invalidConnection: 'InvalidConnection',
  confirmationFailedBusy: 'confirmationFailedBusy',
  confirmationFailed: 'confirmationFailed'
};
var rtc = {
  error: 'error',
  connect: 'connect',
  close: 'close',
  data: 'data',
  signal: 'signal'
};
var stages = {
  initiator: 'initiator',
  receiver: 'receiver'
};
var lifeCycle = {
  RtcInitiatedEvent: 'RtcInitiatedEvent',
  signatureCheck: 'signatureCheck',
  SocketConnectedEvent: 'SocketConnectedEvent',
  confirmationFailedEvent: 'confirmationFailedEvent',
  confirmationFailedBusyEvent: 'confirmationFailedBusyEvent',
  invalidConnectionEvent: 'invalidConnectionEvent',
  codeDisplay: 'codeDisplay',
  checkNumber: 'checkNumber',
  ConnectionId: 'ConnectionId',
  receiverVersion: 'receiverVersion',
  RtcConnectedEvent: 'RtcConnectedEvent',
  RtcClosedEvent: 'RtcClosedEvent',
  RtcDisconnectEvent: 'RtcDisconnectEvent',
  RtcErrorEvent: 'RtcErrorEvent'
};
var communicationTypes = {
  address: 'address',
  signMessage: 'signMessage',
  signTx: 'signTx'
};

var EventEmitter = events.EventEmitter;
var logger = createLogger('MewConnect-Logger');

var MewConnectCommon =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(MewConnectCommon, _EventEmitter);

  /**
   * @param uiCommunicatorFunc
   * @param loggingFunc
   */
  function MewConnectCommon(uiCommunicatorFunc, loggingFunc) {
    var _this;

    _classCallCheck(this, MewConnectCommon);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MewConnectCommon).call(this)); // if null it calls the middleware registered to each specific lifecycle event

    _this.uiCommunicatorFunc = uiCommunicatorFunc || _this.applyLifeCycleListeners;
    _this.logger = loggingFunc || logger.debug;
    _this.isBrowser = browserOrNode.isBrowser;
    _this.middleware = [];
    _this.lifeCycleListeners = [];
    _this.jsonDetails = {
      stunSrvers: _toConsumableArray(stunServers),
      signals: _objectSpread({}, signal),
      stages: _objectSpread({}, stages),
      lifeCycle: _objectSpread({}, lifeCycle),
      rtc: _objectSpread({}, rtc),
      communicationTypes: _objectSpread({}, communicationTypes),
      connectionCodeSeparator: connectionCodeSeparator,
      version: version$1,
      versions: versions,
      connectionCodeSchemas: connectionCodeSchemas
    };
    return _this;
  }
  /**
   *
   * @param uiCommunicationFunc
   */


  _createClass(MewConnectCommon, [{
    key: "setCommunicationFunction",
    value: function setCommunicationFunction(uiCommunicationFunc) {
      this.uiCommunicatorFunc = uiCommunicationFunc;
    }
    /**
     *
     * @param func
     */

  }, {
    key: "use",
    value: function use(func) {
      this.middleware.push(func);
    }
  }, {
    key: "useDataHandlers",
    value: function useDataHandlers(input, fn) {
      var fns = this.middleware.slice(0);
      if (!fns.length) return fn(null);

      function run(i) {
        fns[i](input, function (err) {
          // upon error, short-circuit
          if (err) return fn(err); // if no middleware left, summon callback

          if (!fns[i + 1]) return fn(null); // go on to next

          run(i + 1);
        });
      }

      run(0);
    }
  }, {
    key: "applyDatahandlers",
    value: function applyDatahandlers(data) {
      var _this2 = this;

      // function that runs after all middleware
      var next = function next(args) {
        if (args === null) {
          if (_this2.jsonDetails.communicationTypes[data.type]) {
            throw new Error("No Handler Exists for ".concat(data.type));
          }
        }

        return args;
      };

      this.useDataHandlers(data, next);
    }
    /**
     *
     * @param _signal
     * @param func
     */

  }, {
    key: "registerLifeCycleListener",
    value: function registerLifeCycleListener(_signal, func) {
      if (this.lifeCycleListeners[_signal]) {
        this.lifeCycleListeners[_signal].push(func);
      } else {
        this.lifeCycleListeners[_signal] = [];

        this.lifeCycleListeners[_signal].push(func);
      }
    }
  }, {
    key: "useLifeCycleListeners",
    value: function useLifeCycleListeners(_signal, input, fn) {
      var fns;

      var run = function run(i) {
        fns[i](input, function (err) {
          // upon error, short-circuit
          if (err) return fn(err);
          if (!fns[i + 1]) return fn(null); // if no middleware left, summon callback
          // go on to next

          run(i + 1);
        });
      };

      if (this.lifeCycleListeners[_signal]) {
        fns = this.lifeCycleListeners[_signal].slice(0);
        if (!fns.length) return fn(null);
        run(0);
      }
    }
  }, {
    key: "applyLifeCycleListeners",
    value: function applyLifeCycleListeners(_signal, data) {
      // function that runs after all middleware
      function next(args) {
        return args;
      }

      this.useLifeCycleListeners(_signal, data, next);
    }
    /*
    * allows external function to listen for lifecycle events
    */

  }, {
    key: "uiCommunicator",
    value: function uiCommunicator(event, data) {
      console.log(event, data); // todo remove dev item

      this.emit(event, data);
    }
  }, {
    key: "isJSON",
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }]);

  return MewConnectCommon;
}(EventEmitter);

var buffer = Buffer.buffer;
var logger$1 = createLogger('MewCrypto');
/**
 *
 */

var MewConnectCrypto =
/*#__PURE__*/
function () {
  function MewConnectCrypto() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MewConnectCrypto);

    this.crypto = options.crypto || crypto;
    this.secp256k1 = options.secp256k1 || secp256k1;
    this.ethUtil = options.ethUtils || ethUtils;
    this.Buffer = options.buffer || buffer;
    this.eccrypto = options.eccrypto || eccrypto;
  }

  _createClass(MewConnectCrypto, [{
    key: "setPrivate",

    /**
     *
     * @param pvtKey
     */
    value: function setPrivate(pvtKey) {
      this.prvt = Buffer.from(pvtKey, 'hex');
    }
    /**
     *
     * @returns {*}
     */

  }, {
    key: "generateMessage",
    value: function generateMessage() {
      return this.crypto.randomBytes(32).toString('hex');
    }
    /**
     *
     * @returns {{pub, pvt}}
     */
    // Not the Address, but generate them for the connection check

  }, {
    key: "prepareKey",
    value: function prepareKey() {
      this.prvt = this.generatePrivate(); // Uint8Array

      this.pub = this.generatePublic(this.prvt); // Uint8Array

      return this.addKey(this.pub, this.prvt);
    }
    /**
     *
     * @returns {*}
     */

  }, {
    key: "generatePrivate",
    value: function generatePrivate() {
      var privKey;

      do {
        privKey = this.crypto.randomBytes(32);
      } while (!this.secp256k1.privateKeyVerify(privKey));

      return privKey;
    }
    /**
     *
     * @param privKey
     * @returns {*}
     */

  }, {
    key: "generatePublic",
    value: function generatePublic(privKey) {
      var pvt = new this.Buffer(privKey, 'hex');
      this.prvt = pvt;
      return this.secp256k1.publicKeyCreate(pvt);
    }
    /**
     *
     * @param dataToSend
     * @returns {Promise<string>}
     */

  }, {
    key: "encrypt",
    value: function encrypt(dataToSend) {
      var _this = this;

      var publicKeyA = eccrypto.getPublic(this.prvt);
      return new Promise(function (resolve, reject) {
        _this.eccrypto.encrypt(publicKeyA, _this.Buffer.from(dataToSend)).then(function (_initial) {
          resolve(_initial);
        }).catch(function (error) {
          reject(error);
        });
      });
    }
    /**
     *
     * @param dataToSee
     * @returns {Promise<string>}
     */

  }, {
    key: "decrypt",
    value: function decrypt(dataToSee) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.eccrypto.decrypt(_this2.prvt, {
          ciphertext: Buffer.from(dataToSee.ciphertext),
          ephemPublicKey: Buffer.from(dataToSee.ephemPublicKey),
          iv: Buffer.from(dataToSee.iv),
          mac: Buffer.from(dataToSee.mac)
        }).then(function (_initial) {
          var result;

          try {
            if (_this2.isJSON(_initial)) {
              var humanRadable = JSON.parse(_initial);

              if (Array.isArray(humanRadable)) {
                result = humanRadable[0];
              } else {
                result = humanRadable;
              }
            } else {
              result = _initial.toString();
            }
          } catch (e) {
            logger$1.error(e);
          }

          resolve(JSON.stringify(result));
        }).catch(function (error) {
          reject(error);
        });
      });
    }
    /**
     *
     * @param msgToSign
     * @returns {Promise<string>}
     */

  }, {
    key: "signMessage",
    value: function signMessage(msgToSign) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        try {
          var msg = _this3.ethUtil.hashPersonalMessage(_this3.ethUtil.toBuffer(msgToSign));

          var signed = _this3.ethUtil.ecsign(_this3.Buffer.from(msg), new _this3.Buffer(_this3.prvt, 'hex')); // eslint-disable-next-line max-len


          var combined = _this3.Buffer.concat([_this3.Buffer.from([signed.v]), _this3.Buffer.from(signed.r), _this3.Buffer.from(signed.s)]);

          var combinedHex = combined.toString('hex');
          resolve(combinedHex);
        } catch (e) {
          reject(e);
        }
      });
    }
    /**
     *
     * @param pub
     * @param pvt
     * @returns {{pub: *, pvt: *}}
     */

  }, {
    key: "addKey",
    value: function addKey(pub, pvt) {
      return {
        pub: pub,
        pvt: pvt
      };
    }
    /**
     *
     * @param buf
     * @returns {string}
     */

  }, {
    key: "bufferToConnId",
    value: function bufferToConnId(buf) {
      return buf.toString('hex').slice(32);
    }
  }, {
    key: "isJSON",
    value: function isJSON(arg) {
      try {
        JSON.parse(arg);
        return true;
      } catch (e) {
        return false;
      }
    }
  }], [{
    key: "create",
    value: function create() {
      return new MewConnectCrypto({
        crypto: crypto,
        secp256k1: secp256k1,
        ethUtils: ethUtils,
        buffer: buffer,
        eccrypto: eccrypto
      });
    }
  }]);

  return MewConnectCrypto;
}();

var logger$2 = createLogger('MewConnectInitiator');
/**
 *  Primary Web end of a MEW Connect communication channel
 *  Handles the initial actions to setup said connection
 */

var MewConnectInitiator =
/*#__PURE__*/
function (_MewConnectCommon) {
  _inherits(MewConnectInitiator, _MewConnectCommon);

  /**
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  function MewConnectInitiator() {
    var _this;

    var uiCommunicatorFunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var loggingFunc = arguments.length > 1 ? arguments[1] : undefined;
    var additionalLibs = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, MewConnectInitiator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MewConnectInitiator).call(this, uiCommunicatorFunc, loggingFunc)); // Check if a WebRTC connection exists before a window/tab is closed or refreshed
    // Destroy the connection if one exists

    if (_this.isBrowser) {
      // eslint-disable-next-line no-undef
      window.onunload = window.onbeforeunload = function () {
        if (!!_this.Peer && !_this.Peer.destroyed) {
          _this.rtcDestroy();
        }
      };
    }

    _this.p = null;
    _this.qrCodeString = null;
    _this.socketConnected = false;
    _this.connected = false;
    _this.io = additionalLibs.io || io;
    _this.signals = _this.jsonDetails.signals;
    _this.rtcEvents = _this.jsonDetails.rtc;
    _this.version = _this.jsonDetails.version;
    _this.versions = _this.jsonDetails.versions;
    _this.lifeCycle = _this.jsonDetails.lifeCycle; // Library used to facilitate the WebRTC connection and subsequent communications

    _this.Peer = additionalLibs.wrtc || SimplePeer; // Initial (STUN) server set used to initiate a WebRTC connection

    _this.stunServers = _this.jsonDetails.stunSrvers; // Initialization of the array to hold the TURN server
    // information if the initial connection attempt fails

    _this.turnServers = []; // Object with specific methods used in relation to cryptographic operations

    _this.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create();
    return _this;
  }
  /**
   * Factory function
   */


  _createClass(MewConnectInitiator, [{
    key: "getSocketConnectionState",

    /**
     * Returns a boolean indicating whether the socket connection exists and is active
     */
    value: function getSocketConnectionState() {
      return this.socketConnected;
    }
    /**
     * Returns a boolean indicating whether the WebRTC connection exists and is active
     */

  }, {
    key: "getConnectonState",
    value: function getConnectonState() {
      return this.connected;
    }
    /**
     * Emit/Provide the details used in creating the QR Code
     */

  }, {
    key: "displayCode",
    value: function displayCode(data) {
      this.logger('handshake', data);
      this.socketKey = data;
      var separator = this.jsonDetails.connectionCodeSeparator;
      var qrCodeString = this.version + separator + data + separator + this.connId;
      this.qrCodeString = qrCodeString;
      this.uiCommunicator(this.lifeCycle.codeDisplay, qrCodeString);
      this.uiCommunicator(this.lifeCycle.checkNumber, data);
      this.uiCommunicator(this.lifeCycle.ConnectionId, this.connId);
    } // ////////////// Initialize Communication Process //////////////////////////////

    /**
     * The initial method called to initiate the exchange that can create a WebRTC connection
     */

  }, {
    key: "initiatorStart",
    value: function () {
      var _initiatorStart = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(url) {
        var toSign, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.keys = this.mewCrypto.prepareKey();
                toSign = this.mewCrypto.generateMessage();
                _context.next = 4;
                return this.mewCrypto.signMessage(this.keys.pvt.toString('hex'));

              case 4:
                this.signed = _context.sent;
                this.connId = this.mewCrypto.bufferToConnId(this.keys.pub);
                this.displayCode(this.keys.pvt.toString('hex'));
                this.uiCommunicator(this.lifeCycle.signatureCheck, this.signed);
                options = {
                  query: {
                    stage: 'initiator',
                    signed: this.signed,
                    message: toSign,
                    connId: this.connId
                  },
                  transports: ['websocket', 'polling', 'flashsocket'],
                  secure: true
                };
                this.socketManager = this.io(url, options);
                this.socket = this.socketManager.connect();
                this.initiatorConnect(this.socket);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function initiatorStart(_x) {
        return _initiatorStart.apply(this, arguments);
      };
    }() // ////////////// WebSocket Communication Methods and Handlers //////////////////////////////

    /**
     * Setup message handlers for communication with the signal server
     */

  }, {
    key: "initiatorConnect",
    value: function initiatorConnect(socket) {
      var _this2 = this;

      this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);
      this.socket.on(this.signals.connect, function () {
        _this2.socketConnected = true;

        _this2.applyDatahandlers(JSON.stringify({
          type: 'socketConnected',
          data: null
        }));
      }); // A connection pair exists, create and send WebRTC OFFER

      this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
      // Handle the WebRTC ANSWER from the opposite (mobile) peer

      this.socketOn(this.signals.answer, this.recieveAnswer.bind(this)); // Handle Failure due to an attempt to join a connection with two existing endpoints

      this.socketOn(this.signals.confirmationFailedBusy, function () {
        _this2.uiCommunicator(_this2.lifeCycle.confirmationFailedBusyEvent);

        _this2.logger('confirmation Failed: Busy');
      }); // Handle Failure due to the handshake/ verify details being invalid for the connection ID

      this.socketOn(this.signals.confirmationFailed, function () {
        _this2.uiCommunicator(_this2.lifeCycle.confirmationFailedEvent);

        _this2.logger('confirmation Failed: invalid confirmation');
      }); // Handle Failure due to no opposing peer existing

      this.socketOn(this.signals.invalidConnection, function () {
        _this2.uiCommunicator(_this2.lifeCycle.invalidConnectionEvent); // should be different error message


        _this2.logger('confirmation Failed: no opposite peer found');
      }); // Handle Socket Disconnect Event

      this.socketOn(this.signals.disconnect, function (reason) {
        _this2.logger(reason);

        _this2.socketConnected = false;
      }); // Provide Notice that initial WebRTC connection failed and the fallback method will be used

      this.socketOn(this.signals.attemptingTurn, function () {
        _this2.logger('TRY TURN CONNECTION'); // todo remove dev item

      }); // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN

      this.socketOn(this.signals.turnToken, function (data) {
        _this2.retryViaTurn(data);
      });
      return socket;
    } // Wrapper around socket.emit method

  }, {
    key: "socketEmit",
    value: function socketEmit(signal, data) {
      this.socket.binary(false).emit(signal, data);
    } // Wrapper around socket.disconnect method

  }, {
    key: "socketDisconnect",
    value: function socketDisconnect() {
      this.socket.disconnect();
    } // Wrapper around socket.on listener registration method

  }, {
    key: "socketOn",
    value: function socketOn(signal, func) {
      this.socket.on(signal, func);
    } // /////////////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////// WebRTC Communication Related ///////////////////////////////////////
    // ////////////// WebRTC Communication Setup Methods ///////////////////////////////////////////

    /**
     *  Initial Step in beginning the webRTC setup
     */

  }, {
    key: "sendOffer",
    value: function () {
      var _sendOffer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(data) {
        var plainTextVersion, options;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.mewCrypto.decrypt(data.version);

              case 2:
                plainTextVersion = _context2.sent;
                this.peerVersion = plainTextVersion;
                this.uiCommunicator(this.lifeCycle.receiverVersion, plainTextVersion);
                this.logger('sendOffer', data);
                options = {
                  signalListener: this.initiatorSignalListener,
                  webRtcConfig: {
                    servers: this.stunServers
                  }
                };
                this.initiatorStartRTC(this.socket, options);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function sendOffer(_x2) {
        return _sendOffer.apply(this, arguments);
      };
    }()
    /**
     * creates the WebRTC OFFER.  encrypts the OFFER, and
     * emits it along with the connection ID and STUN/TURN details to the signal server
     */

  }, {
    key: "initiatorSignalListener",
    value: function initiatorSignalListener(socket, options) {
      var _this3 = this;

      return (
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee3(data) {
            var encryptedSend;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;

                    _this3.logger('SIGNAL', JSON.stringify(data));

                    _context3.next = 4;
                    return _this3.mewCrypto.encrypt(JSON.stringify(data));

                  case 4:
                    encryptedSend = _context3.sent;

                    _this3.socketEmit(_this3.signals.offerSignal, {
                      data: encryptedSend,
                      connId: _this3.connId,
                      options: options.servers
                    });

                    _context3.next = 11;
                    break;

                  case 8:
                    _context3.prev = 8;
                    _context3.t0 = _context3["catch"](0);
                    logger$2.error(_context3.t0);

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this, [[0, 8]]);
          }));

          return function (_x3) {
            return _ref.apply(this, arguments);
          };
        }()
      );
    }
  }, {
    key: "recieveAnswer",
    value: function () {
      var _recieveAnswer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(data) {
        var plainTextOffer;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.mewCrypto.decrypt(data.data);

              case 3:
                plainTextOffer = _context4.sent;
                this.rtcRecieveAnswer({
                  data: plainTextOffer
                });
                _context4.next = 10;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                logger$2.error(_context4.t0);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 7]]);
      }));

      return function recieveAnswer(_x4) {
        return _recieveAnswer.apply(this, arguments);
      };
    }()
  }, {
    key: "rtcRecieveAnswer",
    value: function rtcRecieveAnswer(data) {
      this.p.signal(JSON.parse(data.data));
    }
    /**
     * Initiates one side (initial peer) of the WebRTC connection
     */

  }, {
    key: "initiatorStartRTC",
    value: function initiatorStartRTC(socket, options) {
      var webRtcConfig = options.webRtcConfig || {};
      var signalListener = this.initiatorSignalListener(socket, webRtcConfig.servers);
      var webRtcServers = webRtcConfig.servers || this.stunServers;
      var suppliedOptions = options.webRtcOptions || {};
      var defaultOptions = {
        initiator: true,
        trickle: false,
        reconnectTimer: 100,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: webRtcServers
        }
      };

      var simpleOptions = _objectSpread({}, defaultOptions, {
        suppliedOptions: suppliedOptions
      });

      this.uiCommunicator(this.lifeCycle.RtcInitiatedEvent);
      this.p = new this.Peer(simpleOptions);
      this.p.on(this.rtcEvents.error, this.onError.bind(this));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this));
      this.p.on(this.rtcEvents.data, this.onData.bind(this));
      this.p.on(this.rtcEvents.signal, signalListener.bind(this));
      this.logger('simple peer', this.p);
    } // ////////////// WebRTC Communication Event Handlers //////////////////////////////

    /**
     * Emitted when the  webRTC connection is established
     */

  }, {
    key: "onConnect",
    value: function onConnect() {
      var _this4 = this;

      this.logger('CONNECT', 'ok');
      this.connected = true;
      this.socketEmit(this.signals.rtcConnected, this.socketKey);
      this.socketDisconnect();
      setTimeout(function () {
        _this4.uiCommunicator(_this4.lifeCycle.RtcConnectedEvent);

        _this4.applyDatahandlers(JSON.stringify({
          type: 'rtcConnected',
          data: null
        }));
      }, 100);
    }
    /**
     * Emitted when the data is received via the webRTC connection
     */

  }, {
    key: "onData",
    value: function () {
      var _onData = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(data) {
        var decryptedData, parsed;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.logger('DATA RECEIVED', data.toString());
                _context5.prev = 1;

                if (!this.isJSON(data)) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 5;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 5:
                decryptedData = _context5.sent;
                _context5.next = 11;
                break;

              case 8:
                _context5.next = 10;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 10:
                decryptedData = _context5.sent;

              case 11:
                if (this.isJSON(decryptedData)) {
                  parsed = JSON.parse(decryptedData);
                  this.logger('DECRYPTED DATA RECEIVED', parsed);
                  this.emit(parsed.type, parsed.data);
                } else {
                  this.logger('DECRYPTED DATA RECEIVED', decryptedData);
                  this.emit(decryptedData.type, decryptedData.data);
                }

                _context5.next = 19;
                break;

              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](1);
                logger$2.error(_context5.t0);
                this.logger('peer2 ERROR: data=', data);
                this.logger('peer2 ERROR: data.toString()=', data.toString());

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 14]]);
      }));

      return function onData(_x5) {
        return _onData.apply(this, arguments);
      };
    }()
    /**
     * Emitted when one end of the webRTC connection closes
     */

  }, {
    key: "onClose",
    value: function onClose(data) {
      this.logger('WRTC CLOSE');
      this.connected = false;
      this.uiCommunicator(this.lifeCycle.RtcClosedEvent, data);
    }
    /**
     * Emitted when there is an error with the webRTC connection
     */

  }, {
    key: "onError",
    value: function onError(err) {
      logger$2.error('WRTC ERROR');
      this.logger('error', err);
      this.uiCommunicator(this.lifeCycle.RtcErrorEvent, err);
    } // /////////////////////// WebRTC Communication Methods /////////////////////////////////////////

    /**
     * sends a hardcoded message through the rtc connection
     */

  }, {
    key: "testRTC",
    value: function testRTC(msg) {
      var _this5 = this;

      return function () {
        _this5.rtcSend(JSON.stringify({
          type: 2,
          text: msg
        }));
      };
    }
    /**
     * prepare a message to send through the rtc connection. using a closure to
     * hold off calling the rtc object until after it is created
     */

  }, {
    key: "sendRtcMessageClosure",
    value: function sendRtcMessageClosure(type, msg) {
      var _this6 = this;

      return function () {
        _this6.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg);

        _this6.rtcSend(JSON.stringify({
          type: type,
          data: msg
        }));
      };
    }
    /**
     * prepare a message to send through the rtc connection
     */

  }, {
    key: "sendRtcMessage",
    value: function sendRtcMessage(type, msg) {
      this.logger('[SEND RTC MESSAGE] type: ', type, ' message: ', msg);
      this.rtcSend(JSON.stringify({
        type: type,
        data: msg
      }));
    }
    /**
     * Disconnect the current RTC connection
     */

  }, {
    key: "disconnectRTCClosure",
    value: function disconnectRTCClosure() {
      var _this7 = this;

      return function () {
        _this7.uiCommunicator(_this7.lifeCycle.RtcDisconnectEvent);

        _this7.applyDatahandlers(JSON.stringify({
          type: 'rtcDisconnect',
          data: null
        }));

        _this7.rtcDestroy();

        _this7.instance = null;
      };
    }
    /**
     * Disconnect the current RTC connection, and call any clean up methods
     */

  }, {
    key: "disconnectRTC",
    value: function disconnectRTC() {
      this.rtcDestroy();
      this.uiCommunicator(this.lifeCycle.RtcDisconnectEvent);
      this.applyDatahandlers(JSON.stringify({
        type: 'rtcDisconnect',
        data: null
      }));
      this.instance = null;
    }
    /**
     * send a message through the rtc connection
     */

  }, {
    key: "rtcSend",
    value: function () {
      var _rtcSend = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(typeof arg === 'string')) {
                  _context6.next = 6;
                  break;
                }

                _context6.next = 3;
                return this.mewCrypto.encrypt(arg);

              case 3:
                encryptedSend = _context6.sent;
                _context6.next = 9;
                break;

              case 6:
                _context6.next = 8;
                return this.mewCrypto.encrypt(JSON.stringify(arg));

              case 8:
                encryptedSend = _context6.sent;

              case 9:
                this.p.send(JSON.stringify(encryptedSend));

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function rtcSend(_x6) {
        return _rtcSend.apply(this, arguments);
      };
    }()
    /**
     * Disconnect/Destroy the current RTC connection
     */

  }, {
    key: "rtcDestroy",
    value: function rtcDestroy() {
      if (this.p !== null) {
        this.p.destroy();
      }
    } // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////

    /**
     * Fallback Step if initial webRTC connection attempt fails.
     * Retries setting up the WebRTC connection using TURN
     */

  }, {
    key: "retryViaTurn",
    value: function retryViaTurn(data) {
      var options = {
        signalListener: this.initiatorSignalListener,
        webRtcConfig: {
          servers: data.data
        }
      };
      this.initiatorStartRTC(this.socket, options);
    }
  }], [{
    key: "init",
    value: function init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
      return new MewConnectInitiator(uiCommunicatorFunc, loggingFunc, additionalLibs);
    }
  }]);

  return MewConnectInitiator;
}(MewConnectCommon);

var MewConnectInitiatorClient =
/*#__PURE__*/
function (_MewConnectInitiator) {
  _inherits(MewConnectInitiatorClient, _MewConnectInitiator);

  /**
   *  extensions to plug callbacks into specific events/occurrences
   *  without needing to construct separate checking mechanisms
   *  and expose a factory method.
   */
  function MewConnectInitiatorClient(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    var _this;

    _classCallCheck(this, MewConnectInitiatorClient);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MewConnectInitiatorClient).call(this, uiCommunicatorFunc, loggingFunc, additionalLibs));
    _this.qrCodeString = null;
    _this.addressCallback = null;
    _this.signerCallback = null;
    _this.messageSignerCallback = null;
    _this.transactionSignerCallback = null;
    _this.codeDisplayCallback = null;
    _this.rtcConnectedCallback = null;
    _this.rtcClosedCallback = null;
    _this.rtcErrorCallback = null;
    _this.connected = false;
    _this.internalMiddlewareActive = false;
    _this.internalLifeCycleActive = false;
    return _this;
  }
  /**
   * Factory Method that also attaches the created instance to
   * the creating static instance (I think...)
   */


  _createClass(MewConnectInitiatorClient, [{
    key: "isInternalMiddlewareActive",
    value: function isInternalMiddlewareActive() {
      return this.internalMiddlewareActive;
    }
  }, {
    key: "isInternalLifeCycleActive",
    value: function isInternalLifeCycleActive() {
      return this.internalLifeCycleActive;
    }
    /**
     * set a function to handle receipt of the address from the mobile (receiver) peer
     */

  }, {
    key: "setAddressCallback",
    value: function setAddressCallback(func) {
      this.addressCallback = func;
    }
    /**
     * [don't believe this is used]
     * set a function to handle
     */
    // TODO check if this is used or useful

  }, {
    key: "setSignerCallback",
    value: function setSignerCallback(func) {
      this.signerCallback = func;
    }
    /**
     * set a function to handle receipt of a signed message
     */

  }, {
    key: "setMessageSignerCallback",
    value: function setMessageSignerCallback(func) {
      this.messageSignerCallback = func;
    }
    /**
     * set a function to handle receipt of a signed transaction
     */

  }, {
    key: "setTransactionSignerCallback",
    value: function setTransactionSignerCallback(func) {
      this.transactionSignerCallback = func;
    }
    /**
     * set a function to handle communicating lifeCycle events to the UI
     */

  }, {
    key: "setCommunicationFunction",
    value: function setCommunicationFunction(uiCommunicationFunc) {
      this.uiCommunicatorFunc = uiCommunicationFunc;
    }
    /**
     * set a function to handle receipt of the connection detail string (i.e. used to make QR Code)
     */

  }, {
    key: "registerCodeDisplayCallback",
    value: function registerCodeDisplayCallback(func) {
      this.registerLifeCycleListener('codeDisplay', func);
    }
    /**
     * set a function to handle communicating the establishment of the WebRTC session
     */

  }, {
    key: "registerRtcConnectedCallback",
    value: function registerRtcConnectedCallback(func) {
      this.registerLifeCycleListener('RtcConnectedEvent', func);
    }
    /**
     * set a function to handle communicating the WebRTC session closing
     */

  }, {
    key: "registerRtcClosedCallback",
    value: function registerRtcClosedCallback(func) {
      this.registerLifeCycleListener('RtcClosedEvent', func);
    }
    /**
     * set a function to handle communicating an error from the WebRTC session
     */

  }, {
    key: "registerRtcErrorCallback",
    value: function registerRtcErrorCallback(func) {
      this.registerLifeCycleListener('RtcErrorEvent', func);
    }
    /**
     * Call the defined lifeCycle handler functions if they exist, else proceed with
     * applying lifeCycle middleware until one handles the message type (purpose) or it is not handled
     */

  }, {
    key: "configureInternalLifecycle",
    value: function configureInternalLifecycle() {
      var _this2 = this;

      if (!this.internalLifeCycleActive) {
        this.internalLifeCycleActive = true;
        this.use(function (data, next) {
          if (data) {
            if (data.type) {
              switch (data.type) {
                case 'codeDisplay':
                  if (!_this2.codeDisplayCallback) {
                    next();
                  } else {
                    _this2.codeDisplayCallback(data.data);
                  }

                  break;

                case 'RtcConnectedEvent':
                  _this2.connected = true; // if (this.instance) this.instance.connected = true;

                  if (!_this2.rtcConnectedCallback) {
                    next();
                  } else {
                    _this2.rtcConnectedCallback(data.data);
                  }

                  break;
                // case "rtcDisconnect":
                // case "RtcDisconnectEvent":

                case 'RtcClosedEvent':
                  if (!_this2.rtcClosedCallback) {
                    next();
                  } else {
                    _this2.rtcClosedCallback(data.data);
                  }

                  break;

                case 'RtcErrorEvent':
                  if (!_this2.rtcErrorCallback) {
                    next();
                  } else {
                    _this2.rtcErrorCallback(data.data);
                  }

                  break;

                default:
                  next();
                  break;
              }
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
    /**
     * Call a defined message type handler function if it exist, else proceed with
     * applying message middleware until one handles the message type (purpose) or it is not handled
     */

  }, {
    key: "configureInternalMiddleware",
    value: function configureInternalMiddleware() {
      var _this3 = this;

      if (!this.internalMiddlewareActive) {
        this.internalMiddlewareActive = true;
        this.use(function (data, next) {
          if (data) {
            if (data.type) {
              switch (data.type) {
                case 'address':
                  if (!_this3.addressCallback) {
                    next();
                  } else {
                    _this3.addressCallback(data.data);
                  }

                  break;

                case 'sign':
                  if (!_this3.signerCallback) {
                    next();
                  } else {
                    _this3.signerCallback(data.data);
                  }

                  break;

                case 'signMessage':
                  if (!_this3.messageSignerCallback) {
                    next();
                  } else {
                    _this3.messageSignerCallback(data.data);
                  }

                  break;

                case 'signTx':
                  if (!_this3.transactionSignerCallback) {
                    next();
                  } else {
                    _this3.transactionSignerCallback(data.data);
                  }

                  break;

                default:
                  next();
                  break;
              }
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
  }], [{
    key: "init",
    value: function init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
      this.instance = new MewConnectInitiatorClient(uiCommunicatorFunc, loggingFunc, additionalLibs); // }

      return this.instance;
    }
    /**
     * @returns {MewConnect}
     */

  }, {
    key: "get",
    value: function get() {
      return this.instance;
    }
  }]);

  return MewConnectInitiatorClient;
}(MewConnectInitiator);

var logger$3 = createLogger('MewConnectReceiver');

var MewConnectReceiver =
/*#__PURE__*/
function (_MewConnectCommon) {
  _inherits(MewConnectReceiver, _MewConnectCommon);

  /**
   *
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  function MewConnectReceiver(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    var _this;

    _classCallCheck(this, MewConnectReceiver);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MewConnectReceiver).call(this, uiCommunicatorFunc, loggingFunc));

    if (_this.isBrowser) {
      // eslint-disable-next-line no-undef
      window.onunload = window.onbeforeunload = function () {
        if (!!_this.Peer && !_this.Peer.destroyed) {
          _this.rtcDestroy();
        }
      };
    }

    _this.p = null;
    _this.tryTurn = true;
    _this.triedTurn = false;
    _this.io = additionalLibs.io || io;
    _this.signals = _this.jsonDetails.signals;
    _this.rtcEvents = _this.jsonDetails.rtc;
    _this.version = _this.jsonDetails.version;
    _this.versions = _this.jsonDetails.versions; // logger.debug(this.versions); // todo remove dev item
    // Library used to facilitate the WebRTC connection and subsequent communications

    _this.Peer = additionalLibs.wrtc || SimplePeer;
    _this.nodeWebRTC = additionalLibs.webRTC || null; // Initial (STUN) server set used to initiate a WebRTC connection

    _this.stunServers = [{
      url: 'stun:global.stun.twilio.com:3478?transport=udp'
    }]; // Initialization of the array to hold the TURN
    // server information if the initial connection attempt fails

    _this.turnServers = []; // Object with specific methods used in relation to cryptographic operations

    _this.mewCrypto = additionalLibs.cryptoImpl || MewConnectCrypto.create(); // this.mewCrypto = additionalLibs.cryptoImpl || new MewConnect.Crypto({
    //     eccrypto,
    //     crypto,
    //     secp256k1,
    //     ethUtils,
    //     buffer
    //   });

    return _this;
  }
  /**
   * Helper method for parsing the connection details string (data in the QR Code)
   */
  // eslint-disable-next-line consistent-return


  _createClass(MewConnectReceiver, [{
    key: "parseConnectionCodeString",
    value: function parseConnectionCodeString(str) {
      try {
        var connParts = str.split(this.jsonDetails.connectionCodeSeparator);

        if (this.versions.indexOf(connParts[0].trim()) > -1) {
          return {
            connId: connParts[2].trim(),
            key: connParts[1].trim(),
            version: connParts[0].trim()
          };
        }

        return {
          connId: connParts[1].trim(),
          key: connParts[0].trim()
        };
      } catch (e) {
        logger$3.error(e);
      }
    } // ////////////// Initialize Communication Process //////////////////////////////

    /**
     * The reply method called to continue the exchange that can create a WebRTC connection
     */

  }, {
    key: "receiverStart",
    value: function () {
      var _receiverStart = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(url, params) {
        var _this2 = this;

        var signed, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                // Set the private key sent via a QR code scan
                this.mewCrypto.setPrivate(params.key);
                _context.next = 4;
                return this.mewCrypto.signMessage(params.key);

              case 4:
                signed = _context.sent;
                this.connId = params.connId;
                options = {
                  query: {
                    signed: signed,
                    connId: this.connId,
                    stage: 'receiver'
                  },
                  secure: true
                };
                this.socketManager = this.io(url, options);
                this.socket = this.socketManager.connect(); // identity and locate an opposing peer

                this.socketOn(this.signals.handshake, this.socketHandshake.bind(this)); // Handle the WebRTC OFFER from the opposite (web) peer

                this.socketOn(this.signals.offer, this.processOfferReceipt.bind(this)); // Handle Failure due to no opposing peer existing

                this.socketOn(this.signals.invalidConnection, function () {
                  _this2.uiCommunicator('InvalidConnection');
                }); // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN

                this.socketOn(this.signals.turnToken, function (data) {
                  _this2.retryViaTurn(data);
                });
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](0);
                logger$3.error(_context.t0);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 15]]);
      }));

      return function receiverStart(_x, _x2) {
        return _receiverStart.apply(this, arguments);
      };
    }()
  }, {
    key: "socketHandshake",
    value: function () {
      var _socketHandshake = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var encryptedVersion;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.mewCrypto.signMessage(this.mewCrypto.prvt.toString('hex'));

              case 2:
                this.signed = _context2.sent;
                this.uiCommunicator('signatureCheck', this.signed);
                _context2.next = 6;
                return this.mewCrypto.encrypt(this.version);

              case 6:
                encryptedVersion = _context2.sent;
                this.socketEmit(this.signals.signature, {
                  signed: this.signed,
                  connId: this.connId,
                  version: encryptedVersion
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function socketHandshake() {
        return _socketHandshake.apply(this, arguments);
      };
    }() // Wrapper around socket.emit method

  }, {
    key: "socketEmit",
    value: function socketEmit(signal, data) {
      this.socket.emit(signal, data);
    } // Wrapper around socket.disconnect method

  }, {
    key: "socketDisconnect",
    value: function socketDisconnect() {
      this.socket.disconnect();
    } // Wrapper around socket.on listener registration method

  }, {
    key: "socketOn",
    value: function socketOn(signal, func) {
      if (typeof func !== 'function') logger$3.error('not a function?', signal); // one of the handlers is/was not initializing properly

      this.socket.on(signal, func);
    } // /////////////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////// WebRTC Communication Related ///////////////////////////////////////
    // ////////////// WebRTC Communication Setup Methods ///////////////////////////////////////////

    /**
     * Processes the WebRTC OFFER
     */

  }, {
    key: "processOfferReceipt",
    value: function () {
      var _processOfferReceipt = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(data) {
        var decryptedOffer, decryptedData;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.mewCrypto.decrypt(data.data);

              case 3:
                decryptedOffer = _context3.sent;
                decryptedData = {
                  data: decryptedOffer
                };
                this.receiveOffer(decryptedData);
                _context3.next = 11;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                logger$3.error(_context3.t0);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 8]]);
      }));

      return function processOfferReceipt(_x3) {
        return _processOfferReceipt.apply(this, arguments);
      };
    }()
    /**
     * creates the WebRTC ANSWER (Receives the answer created by the webrtc lib) and
     * emits it along with the connection ID to the signal server
     */

  }, {
    key: "onSignal",
    value: function () {
      var _onSignal = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(data) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.logger('SIGNAL: ', JSON.stringify(data));
                _context4.next = 3;
                return this.mewCrypto.encrypt(JSON.stringify(data));

              case 3:
                encryptedSend = _context4.sent;
                this.socketEmit(this.signals.answerSignal, {
                  data: encryptedSend,
                  connId: this.connId
                });
                this.uiCommunicator('RtcSignalEvent');

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function onSignal(_x4) {
        return _onSignal.apply(this, arguments);
      };
    }()
    /**
     * Initiates one side (recipient peer) of the WebRTC connection
     */

  }, {
    key: "receiveOffer",
    value: function receiveOffer(data) {
      this.logger(data);
      var webRtcConfig = data.options || {};
      var webRtcServers = webRtcConfig.servers || this.stunServers;
      var simpleOptions = {
        initiator: false,
        trickle: false,
        reconnectTimer: 100,
        iceTransportPolicy: 'relay',
        config: {
          iceServers: webRtcServers
        }
      };

      if (!this.isBrowser && this.nodeWebRTC) {
        simpleOptions.wrtc = this.nodeWebRTC;
      }

      this.p = new this.Peer(simpleOptions);
      this.p.signal(JSON.parse(data.data));
      this.p.on(this.rtcEvents.error, this.onError.bind(this));
      this.p.on(this.rtcEvents.connect, this.onConnect.bind(this));
      this.p.on(this.rtcEvents.close, this.onClose.bind(this));
      this.p.on(this.rtcEvents.data, this.onData.bind(this));
      this.p.on('signal', this.onSignal.bind(this));
    } // ////////////// WebRTC Communication Event Handlers //////////////////////////////

    /**
     * Emitted when the  webRTC connection is established
     */

  }, {
    key: "onConnect",
    value: function onConnect() {
      this.logger('CONNECTED');
      this.uiCommunicator('RtcConnectedEvent');
      this.socketEmit(this.signals.rtcConnected, this.connId);
      this.tryTurn = false;
      this.socketDisconnect();
    }
    /**
     * Emitted when the data is received via the webRTC connection
     */

  }, {
    key: "onData",
    value: function () {
      var _onData = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(data) {
        var decryptedData;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.logger('DATA RECEIVED', data.toString());
                _context5.prev = 1;

                if (!this.isJSON(data)) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 5;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 5:
                decryptedData = _context5.sent;
                _context5.next = 11;
                break;

              case 8:
                _context5.next = 10;
                return this.mewCrypto.decrypt(JSON.parse(data.toString()));

              case 10:
                decryptedData = _context5.sent;

              case 11:
                if (this.isJSON(decryptedData)) {
                  this.applyDatahandlers(JSON.parse(decryptedData));
                } else {
                  this.applyDatahandlers(decryptedData);
                }

                _context5.next = 19;
                break;

              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](1);
                logger$3.error(_context5.t0);
                this.logger('peer2 ERROR: data=', data);
                this.logger('peer2 ERROR: data.toString()=', data.toString());

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 14]]);
      }));

      return function onData(_x5) {
        return _onData.apply(this, arguments);
      };
    }()
    /**
     * Emitted when one end of the webRTC connection closes
     */

  }, {
    key: "onClose",
    value: function onClose() {
      this.logger('WRTC CLOSE');
      this.uiCommunicator('RtcClosedEvent');

      if (!this.triedTurn && this.tryTurn) {
        this.attemptTurnConnect();
      }
    }
    /**
     * Emitted when there is an error with the webRTC connection
     */

  }, {
    key: "onError",
    value: function onError(err) {
      logger$3.error('WRTC ERROR');
      logger$3.error(err);
    } // /////////////////////////// WebRTC Communication Methods ///////////////////////////////////

    /**
     * sends a hardcoded message through the rtc connection
     */

  }, {
    key: "testRTC",
    value: function testRTC(msg) {
      var _this3 = this;

      return function () {
        _this3.rtcSend(JSON.stringify({
          type: 2,
          text: msg
        }));
      };
    }
    /**
     * prepare a message to send through the rtc connection,
     * using a closure to hold off calling the rtc object until after it is created
     */

  }, {
    key: "sendRtcMessage",
    value: function sendRtcMessage(type, msg) {
      var _this4 = this;

      return function () {
        _this4.rtcSend(JSON.stringify({
          type: type,
          data: msg
        }));
      };
    }
    /**
     * prepare a message to send through the rtc connection
     */

  }, {
    key: "sendRtcMessageResponse",
    value: function sendRtcMessageResponse(type, msg) {
      this.rtcSend(JSON.stringify({
        type: type,
        data: msg
      }));
    }
    /**
     * Disconnect the current RTC connection
     */

  }, {
    key: "disconnectRTC",
    value: function disconnectRTC() {
      var _this5 = this;

      return function () {
        _this5.uiCommunicator('RtcDisconnectEvent');

        _this5.rtcDestroy();
      };
    }
    /**
     * send a message through the rtc connection
     */

  }, {
    key: "rtcSend",
    value: function () {
      var _rtcSend = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(arg) {
        var encryptedSend;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(typeof arg === 'string')) {
                  _context6.next = 6;
                  break;
                }

                _context6.next = 3;
                return this.mewCrypto.encrypt(arg);

              case 3:
                encryptedSend = _context6.sent;
                _context6.next = 9;
                break;

              case 6:
                _context6.next = 8;
                return this.mewCrypto.encrypt(JSON.stringify(arg));

              case 8:
                encryptedSend = _context6.sent;

              case 9:
                this.p.send(JSON.stringify(encryptedSend));

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function rtcSend(_x6) {
        return _rtcSend.apply(this, arguments);
      };
    }()
    /**
     * Disconnect/Destroy the current RTC connection
     */

  }, {
    key: "rtcDestroy",
    value: function rtcDestroy() {
      this.p.destroy();
    } // ////////////// WebRTC Communication TURN Fallback Initiator/Handler ///////////////////////////

    /**
     * Fallback Step if initial webRTC connection attempt fails.
     * Retries setting up the WebRTC connection using TURN
     */

  }, {
    key: "attemptTurnConnect",
    value: function attemptTurnConnect() {
      this.triedTurn = true;
      this.socketEmit(this.signals.tryTurn, {
        connId: this.connId,
        cont: true
      });
    }
  }]);

  return MewConnectReceiver;
}(MewConnectCommon);

var MewConnectReceiverClient =
/*#__PURE__*/
function (_MewConnectReceiver) {
  _inherits(MewConnectReceiverClient, _MewConnectReceiver);

  /**
   *  extensions to plug callbacks into specific events/occupancies
   *  without needing to construct separate checking mechanisms
   *  and expose a factory method.  Primarily for usage in
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   */
  function MewConnectReceiverClient(uiCommunicatorFunc, loggingFunc, additionalLibs) {
    var _this;

    _classCallCheck(this, MewConnectReceiverClient);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MewConnectReceiverClient).call(this, uiCommunicatorFunc, loggingFunc, additionalLibs));
    _this.qrCodeString = null;
    _this.addressCallback = null;
    _this.signerCallback = null;
    _this.messageSignerCallback = null;
    _this.transactionSignerCallback = null;
    _this.codeDisplayCallback = null;
    _this.rtcConnectedCallback = null;
    _this.rtcClosedCallback = null;
    _this.connected = false;
    _this.internalMiddlewareActive = false;
    _this.internalLifeCycleActive = false;
    return _this;
  }
  /**
   *
   * @param uiCommunicatorFunc
   * @param loggingFunc
   * @param additionalLibs
   * @returns {MewConnect}
   */


  _createClass(MewConnectReceiverClient, [{
    key: "isInternalMiddlewareActive",

    /**
     *
     * @returns {boolean}
     */
    value: function isInternalMiddlewareActive() {
      return this.internalMiddlewareActive;
    }
    /**
     *
     * @returns {boolean}
     */

  }, {
    key: "isInternalLifeCycleActive",
    value: function isInternalLifeCycleActive() {
      return this.internalLifeCycleActive;
    }
    /**
     *
     * @param func
     */

  }, {
    key: "setAddressCallback",
    value: function setAddressCallback(func) {
      this.addressCallback = func;
    }
    /**
     *
     * @param func
     */

  }, {
    key: "setSignerCallback",
    value: function setSignerCallback(func) {
      this.signerCallback = func;
    }
    /**
     *
     * @param func
     */

  }, {
    key: "setMessageSignerCallback",
    value: function setMessageSignerCallback(func) {
      this.messageSignerCallback = func;
    }
    /**
     *
     * @param func
     */

  }, {
    key: "setTransactionSignerCallback",
    value: function setTransactionSignerCallback(func) {
      this.transactionSignerCallback = func;
    }
    /**
     *
     * @param uiCommunicationFunc
     */

  }, {
    key: "setCommunicationFunction",
    value: function setCommunicationFunction(uiCommunicationFunc) {
      this.uiCommunicatorFunc = uiCommunicationFunc;
    }
    /**
     *
     * @param func
     */

  }, {
    key: "registerCodeDisplayCallback",
    value: function registerCodeDisplayCallback(func) {
      this.registerLifeCycleListener('codeDisplay', func);
    }
    /**
     *
     * @param func
     */

  }, {
    key: "registerRtcConnectedCallback",
    value: function registerRtcConnectedCallback(func) {
      this.registerLifeCycleListener('RtcConnectedEvent', func);
    }
    /**
     *
     * @param func
     */

  }, {
    key: "registerRtcClosedCallback",
    value: function registerRtcClosedCallback(func) {
      this.registerLifeCycleListener('RtcClosedEvent', func);
    }
    /**
     *
     */

  }, {
    key: "configureInternalLifecycle",
    value: function configureInternalLifecycle() {
      var _this2 = this;

      if (!this.internalLifeCycleActive) {
        this.internalLifeCycleActive = true;
        this.use(function (data, next) {
          if (data) {
            if (data.type) {
              switch (data.type) {
                case 'codeDisplay':
                  if (!_this2.codeDisplayCallback) {
                    next();
                  } else {
                    _this2.codeDisplayCallback(data.data);
                  }

                  break;

                case 'RtcConnectedEvent':
                  _this2.connected = true; // if (this.instance) this.instance.connected = true;

                  if (!_this2.rtcConnectedCallback) {
                    next();
                  } else {
                    _this2.rtcConnectedCallback(data.data);
                  }

                  break;
                // case "rtcDisconnect":
                // case "RtcDisconnectEvent":

                case 'RtcClosedEvent':
                  if (!_this2.rtcClosedCallback) {
                    next();
                  } else {
                    _this2.rtcClosedCallback(data.data);
                  }

                  break;

                default:
                  next();
                  break;
              }
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
    /**
     *
     */

  }, {
    key: "configureInternalMiddleware",
    value: function configureInternalMiddleware() {
      var _this3 = this;

      if (!this.internalMiddlewareActive) {
        this.internalMiddlewareActive = true;
        this.use(function (data, next) {
          if (data) {
            if (data.type) {
              switch (data.type) {
                case 'address':
                  if (!_this3.addressCallback) {
                    next();
                  } else {
                    _this3.addressCallback(data.data);
                  }

                  break;

                case 'sign':
                  if (!_this3.signerCallback) {
                    next();
                  } else {
                    _this3.signerCallback(data.data);
                  }

                  break;

                case 'signMessage':
                  if (!_this3.messageSignerCallback) {
                    next();
                  } else {
                    _this3.messageSignerCallback(data.data);
                  }

                  break;

                case 'signTx':
                  if (!_this3.transactionSignerCallback) {
                    next();
                  } else {
                    _this3.transactionSignerCallback(data.data);
                  }

                  break;

                default:
                  next();
                  break;
              }
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
  }], [{
    key: "init",
    value: function init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
      if (typeof MewConnect !== 'undefined') {
        // eslint-disable-next-line no-undef
        this.instance = new MewConnect(uiCommunicatorFunc, loggingFunc, additionalLibs);
      } else {
        // eslint-disable-next-line max-len
        this.instance = new MewConnectReceiverClient(uiCommunicatorFunc, loggingFunc, additionalLibs);
      } // this.instance = new MewConnect(uiCommunicatorFunc, loggingFunc, additionalLibs);


      return this.instance;
    }
    /**
     *
     * @returns {MewConnect}
     */

  }, {
    key: "get",
    value: function get() {
      return this.instance;
    }
  }]);

  return MewConnectReceiverClient;
}(MewConnectReceiver);

// INITIATOR CLIENT
var index = {
  Crypto: MewConnectCrypto,
  Initiator: MewConnectInitiator,
  InitiatorClient: MewConnectInitiatorClient,
  ReceiverClient: MewConnectReceiverClient
};

module.exports = index;
