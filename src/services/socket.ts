import { io } from 'socket.io-client'
import log from 'sistemium-debug'
import store from '@/store'
import { eachSeries } from 'async'

const { debug, error } = log('socket')
export type SubscriptionHandler = (fullDocument?: Record<string, any>) => any | Promise<any>

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
  transports: ['websocket'],
})

export interface ChangesPayload {
  collection: string
  fullDocument: Record<string, any>
}

export function bindEvents() {
  debug('bindEvents')
  socket
    .on('connect', () => {
      debug('connect')
      triggerAllSubscriptions()
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
      setTimeout(() => socket.connect(), 5000)
    })
    .on('changes', ({ collection, fullDocument }: ChangesPayload) => {
      debug('changes', collection)
      triggerSubscription(collection, fullDocument)
        .catch(e => {
          error(e)
        })
    })

}

export async function subscribeChanges(keys: string | string[], callback: SubscriptionHandler, auto = true) {
  if (auto) {
    await callback()
  }
  const arr = typeof keys === 'string' ? [keys] : keys
  arr.forEach(key => {
    if (SUBS.get(key)) {
      return
    }
    SUBS.set(key, callback)
  })
}

export function unsubscribeChanges(keys: string | string[]) {
  const arr = typeof keys === 'string' ? [keys] : keys
  arr.forEach(key => {
    SUBS.delete(key)
  })
}

export async function triggerSubscription(collection: string, fullDocument?: Record<string, any>) {
  SUBS.get(collection)?.call(null, fullDocument)
}

export function triggerAllSubscriptions() {
  eachSeries(Array.from(SUBS.keys()), async key => {
    debug('triggerAll', key)
    await SUBS.get(key)?.call(null)
  })
    .catch(error)
}
