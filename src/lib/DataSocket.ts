import { io, type Socket } from 'socket.io-client'
// import log from 'sistemium-debug'
//
// const { debug } = log('DataSocket')

const debug = console.log

export default class DataSocket {
  private socket: Socket
  private token?: string
  constructor() {
    this.socket = io({
      autoConnect: false,
      auth: (cb) => {
        if (!this.token) {
          console.error('empty token')
        }
        try {
          debug('auth', this.token)
          cb({ token: this.token })
        } catch (e) {
          console.error(e)
        }
      },
      transports: ['websocket'],
    })
  }
  off() {
    return this.socket.off()
  }
  getToken() {
    return this.token
  }
  reconnect() {
    return this.socket.connect()
  }
  authorize(token: string) {
    if (this.token === token) {
      debug('already authorized')
    }
    this.token = token
    if (this.socket.connected) {
      debug('already connected')
      return
    }
    this.socket.connect()
  }
  disconnect() {
    // this.socket.off()
    this.socket.disconnect()
  }
  rebind() {
    this.socket.off()
  }
  on(ev: string, listener: (...args: any[]) => void): DataSocket {
    this.socket.on(ev, listener)
    return this
  }
}
