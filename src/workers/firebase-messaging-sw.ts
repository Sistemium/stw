/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { showMessage, urlFromMessage } from '@/services/messaging'
import { clientsClaim } from 'workbox-core'
import { type MessagePayload } from 'firebase/messaging'
import DataSocket from '@/lib/DataSocket'
import Dexie, { type EntityTable } from 'dexie'

const socket = new DataSocket()

interface Setting {
  id: string
  value: string
}

const db = new Dexie('stw-store') as Dexie & { setting: EntityTable<Setting, 'id'> }
db.version(1).stores({
  settings: '',
})
db.version(2).stores({
  setting: 'id,value',
  settings: null,
})
db.version(3).stores({
  setting: 'id',
})

console.log('Using Dexie v' + Dexie.semVer)

async function get(key: string) {
  const setting = await db.setting.get(key)
  return setting?.value
}

async function set(id: string, value: string) {
  return db.setting.put({ value, id })
}

async function del(key: string) {
  return db.setting.delete(key)
}

self.skipWaiting()
  .then(async () => {
    notifyClients({ type: 'start' })
    const token = await get('authorization')
    console.info('skipped', token)
    if (token) {
      socket.authorize(token)
    }
  })
  .catch(e => {
    console.error(e)
  })


console.log('firebase-messaging-sw init with skipWaiting')

socket
  .on('connect', () => {
    console.info('socket:connect')
    notifyClients({ type: 'connect' })
  })
  .on('disconnect', () => {
    console.info('socket:disconnect')
  })
  .on('error', e => {
    console.error('socket:error', e)
  })
  .on('connect_error', (err) => {
    console.log('socket:connect_error', err.message)
    // setTimeout(() => socket.reconnect(), 5000)
  })
  .on('changes', (payload) => {
    notifyClients({
      type: 'changes',
      payload,
    })
  })

clientsClaim()

self.addEventListener('push', (event) => {
  const getPayload = (): Partial<MessagePayload> => {
    try {
      return event.data?.json()
    } catch (e) {
      return {
        notification: {
          title: event.data?.text(),
        },
      }
    }
  }
  event.waitUntil(showMessage(getPayload(), self.registration))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close() // Android needs explicit close
  // console.log('notificationClick', event.notification.data, self.origin)
  const path = urlFromMessage(event.notification.data)
  const url = [
    self.origin,
    path,
  ].filter(x => x)
    .join('/#/')
  event.waitUntil(self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(async windowClients => {
      const opened = windowClients.find(client => {
        return client.url.startsWith(self.origin) && 'focus' in client
      })
      if (opened) {
        await opened.focus()
        if (path && opened.url !== url) {
          await opened.navigate(url)
        }
        return
      }

      return self.clients.openWindow(url)
    }),
  )
})

self.addEventListener('message', event => {
  if (event.data?.type === 'AUTH') {
    console.log('AUTH')
    set('authorization', event.data.token)
      .then(() => {
        socket.authorize(event.data.token)
      })
      .catch(e => {
        console.error(e)
      })
  }
  if (event.data?.type === 'LOG_OFF') {
    console.log('LOG_OFF')
    del('authorization')
      .catch(e => {
        console.error(e)
      })
    socket.disconnect()
  }
})


interface ClientMessage {
  type: string

  [key: string]: any
}

function notifyClients(message: ClientMessage) {
  self.clients.matchAll().then(clients => {
    console.log('notifyClients', clients.length, message.type)
    clients.forEach(client => {
      client.postMessage(message)
    })
  })
    .catch(e => {
      console.error('notifyClients', e)
    })
}
