import log from 'sistemium-debug'
import { eachSeries } from 'async'
import day from 'dayjs'

const { debug, error } = log('socket')
export type SubscriptionHandler = (fullDocument?: Record<string, any>) => any | Promise<any>

const SUBS = new Map<string, SubscriptionHandler>()
const channel = new BroadcastChannel('leader-election');
const WORKER_KEEPALIVE = Number(import.meta.env.VITE_WORKER_KEEPALIVE || '0')


export interface ChangesPayload {
  collection: string
  fullDocument: Record<string, any>
}

let interval: number
let lastPing: Date = new Date()

channel.addEventListener('message', (event) => {
  if (event.data.type === 'PING') {
    lastPing = new Date()
  }
});

export function authorizeSocket(token: string) {
  debug('authorizeSocket')
  navigator.serviceWorker.ready.then(() => {
    debug('worker:ready')
    navigator.serviceWorker.controller?.postMessage({
      type: 'AUTH',
      token,
    })
    if (!WORKER_KEEPALIVE) {
      return
    }
    if (interval) {
      clearInterval(interval)
    }
    interval = setInterval(() => {
      if (day().diff(lastPing, 'millisecond') < 10000) {
        return
      }
      channel.postMessage({ type: 'PING' })
      navigator.serviceWorker.controller?.postMessage({
        type: 'PING',
      })
    }, WORKER_KEEPALIVE)
  })
}

export function logoffSocket() {
  navigator.serviceWorker.controller?.postMessage({
    type: 'LOG_OFF',
  })
  clearInterval(interval)
}

export function bindEvents() {
  // socket.off()
  debug('bindEvents')
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'changes') {
      return onChanges(event.data.payload)
    }
    if (event.data?.type === 'connect') {
      return triggerAllSubscriptions()
    }
    if (event.data?.type === 'start') {
      debug('sw:start')
    }
  })

  navigator.serviceWorker.addEventListener('controllerchange', (ev) => {
    console.warn('controllerChange', ev)
    window.location.reload()
  })

}

function onChanges({ collection, fullDocument }: ChangesPayload) {
  debug('changes', collection)
  triggerSubscription(collection, fullDocument)
    .catch(e => {
      error(e)
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
