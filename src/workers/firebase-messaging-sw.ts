/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { showMessage, urlFromMessage } from '@/services/messaging'
import { clientsClaim } from 'workbox-core'
import { type MessagePayload } from 'firebase/messaging'
import DataSocket from '@/lib/DataSocket'
import { IDBPDatabase, openDB } from 'idb'

const socket = new DataSocket()
const dbPromise: Promise<IDBPDatabase> = openDB('stw-store', 1, {
  upgrade(db) {
    db.createObjectStore('settings');
  },
});

async function get(key: string) {
  return (await dbPromise).get('settings', key);
}
async function set(key: string, val: string) {
  return (await dbPromise).put('settings', val, key);
}
async function del(key: string) {
  return (await dbPromise).delete('settings', key);
}

self.skipWaiting()
  .then(async () => {
    console.info('skipped')
    notifyClients({ type: 'start' })
    const token = await get('authorization')
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
  [key:string]: any
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
