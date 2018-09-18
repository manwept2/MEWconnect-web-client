/* eslint-disable no-console */
import createLogger from 'logging'
import { isBrowser } from 'browser-or-node'
import events from 'events'
import {
  versions,
  connectionCodeSchemas,
  connectionCodeSeparator,
  signal,
  rtc,
  stages,
  lifeCycle,
  communicationTypes
} from './constants'
import { version, stunServers } from './config'

const EventEmitter = events.EventEmitter

const logger = createLogger('MewConnect-Logger')

class MewConnectCommon extends EventEmitter {
  /**
   * @param uiCommunicatorFunc
   * @param loggingFunc
   */
  constructor(uiCommunicatorFunc, loggingFunc) {
    super()
    // if null it calls the middleware registered to each specific lifecycle event
    this.uiCommunicatorFunc = uiCommunicatorFunc || this.applyLifeCycleListeners
    this.logger = loggingFunc || logger.debug

    this.isBrowser = isBrowser
    this.middleware = []
    this.lifeCycleListeners = []

    this.jsonDetails = {
      stunSrvers: [...stunServers],
      signals: {
        ...signal
      },
      stages: {
        ...stages
      },
      lifeCycle: {
        ...lifeCycle
      },
      rtc: {
        ...rtc
      },
      communicationTypes: {
        ...communicationTypes
      },
      connectionCodeSeparator,
      version,
      versions,
      connectionCodeSchemas
    }
  }

  /**
   *
   * @param uiCommunicationFunc
   */
  setCommunicationFunction(uiCommunicationFunc) {
    this.uiCommunicatorFunc = uiCommunicationFunc
  }

  /**
   *
   * @param func
   */
  use(func) {
    this.middleware.push(func)
  }

  useDataHandlers(input, fn) {
    const fns = this.middleware.slice(0)
    if (!fns.length) return fn(null)

    function run(i) {
      fns[i](input, err => {
        // upon error, short-circuit
        if (err) return fn(err)

        // if no middleware left, summon callback
        if (!fns[i + 1]) return fn(null)

        // go on to next
        run(i + 1)
      })
    }
    run(0)
  }

  applyDatahandlers(data) {
    // function that runs after all middleware
    const next = args => {
      if (args === null) {
        if (this.jsonDetails.communicationTypes[data.type]) {
          throw new Error(`No Handler Exists for ${data.type}`)
        }
      }
      return args
    }
    this.useDataHandlers(data, next)
  }

  /**
   *
   * @param _signal
   * @param func
   */
  registerLifeCycleListener(_signal, func) {
    if (this.lifeCycleListeners[_signal]) {
      this.lifeCycleListeners[_signal].push(func)
    } else {
      this.lifeCycleListeners[_signal] = []
      this.lifeCycleListeners[_signal].push(func)
    }
  }

  useLifeCycleListeners(_signal, input, fn) {
    let fns
    const run = i => {
      fns[i](input, err => {
        // upon error, short-circuit
        if (err) return fn(err)
        if (!fns[i + 1]) return fn(null) // if no middleware left, summon callback

        // go on to next
        run(i + 1)
      })
    }
    if (this.lifeCycleListeners[_signal]) {
      fns = this.lifeCycleListeners[_signal].slice(0)
      if (!fns.length) return fn(null)
      run(0)
    }
  }

  applyLifeCycleListeners(_signal, data) {
    // function that runs after all middleware
    function next(args) {
      return args
    }
    this.useLifeCycleListeners(_signal, data, next)
  }

  /*
  * allows external function to listen for lifecycle events
  */
  uiCommunicator(event, data) {
    console.log(event, data) // todo remove dev item
    this.emit(event, data)
  }

  isJSON(arg) {
    try {
      JSON.parse(arg)
      return true
    } catch (e) {
      return false
    }
  }
}

export default MewConnectCommon
