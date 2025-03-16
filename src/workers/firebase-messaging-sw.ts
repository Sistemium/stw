/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { showMessage, urlFromMessage } from '@/services/messaging'
import { clientsClaim } from 'workbox-core'
import { type MessagePayload } from 'firebase/messaging'

self.skipWaiting()
  .catch(e => {
    console.error(e)
  })

clientsClaim()

console.log('firebase-messaging-sw init with skipWaiting')

self.addEventListener('push', (event) => {
  const payload: MessagePayload = event.data?.json()
  event.waitUntil(showMessage(payload, self.registration))
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
