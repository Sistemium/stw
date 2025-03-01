import { io } from 'socket.io-client'
import log from 'sistemium-debug'
import store from '@/store'

const { debug } = log('socket')
export type SubscriptionHandler = () => void | Promise<void>

const SUBS = new Map<string, SubscriptionHandler>()

export const socket = io({
  autoConnect: false,
  auth: (cb) => {
    try {
      const token = store.getters['auth/ACCESS_TOKEN'] as string
      debug('auth', token)
      cb({ token })
    } catch (e) {
      console.error(e)
    }
  },
})

export interface ChangesPayload {
  collection: string
}

export function bindEvents() {
  debug('bindEvents')
  socket
    .on('connect', () => {
      debug('connect')
    })
    .on('disconnect', () => {
      debug('disconnect')
    })
    .on('foo', (...args) => {
      debug('foo', args)
    })
    .on('error', e => {
      debug('error', e)
    })
    .on('connect_error', (err) => {
      console.log(err.message) // prints the message associated with the error
    })
    .on('changes', ({ collection }: ChangesPayload) => {
      debug('changes', collection)
      SUBS.get(collection)?.call(null)
    })

}

export function subscribeChanges(keys: string | string[], callback: SubscriptionHandler) {
  const arr = typeof keys === 'string' ? [keys] : keys
  arr.forEach(key => {
    if (SUBS.get(key)) {
      return
    }
    SUBS.set(key, callback)
  })
}
