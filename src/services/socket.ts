import log from 'sistemium-debug'
import { eachSeries } from 'async'
import day from 'dayjs'

const { debug, error } = log('socket')
export type SubscriptionHandler = (fullDocument?: Record<string, any>) => any | Promise<any>

const SUBS = new Map<string, SubscriptionHandler>()
const channel = new BroadcastChannel('leader-election')
const WORKER_KEEPALIVE = Number(import.meta.env.VITE_WORKER_KEEPALIVE || '0')


export interface ChangesPayload {
  collection: string
  fullDocument: Record<string, any>
}

let interval: any
let lastPing: Date = new Date()

channel.addEventListener('message', (event) => {
  if (event.data.type === 'PING') {
    lastPing = new Date()
  }
})

function keepAliveWorker() {
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => {
    pingWorker()
  }, WORKER_KEEPALIVE)
  pingWorker()
}

function pingWorker() {
  if (day().diff(lastPing, 'millisecond') < 10000) {
    return
  }
  if (document.visibilityState !== 'visible') {
    return
  }
  channel.postMessage({ type: 'PING' })
  navigator.serviceWorker.controller?.postMessage({ type: 'PING' })
}

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
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        keepAliveWorker()
      } else if (interval) {
        clearInterval(interval)
      }
    })
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
    const type: string | undefined = event.data?.type
    if (!type) {
      return
    }
    switch (type) {
      case 'changes': {
        return onChanges(event.data.payload)
      }
      case 'connect': {
        return triggerAllSubscriptions()
      }
      case 'IDB-RESPONSE': {
        return
      }
      case 'reload': {
        return window.location.reload()
      }
      default: {
        debug('sw:', type)
      }
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
