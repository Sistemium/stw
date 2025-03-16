/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { showMessage, urlFromMessage } from '@/services/messaging'
import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import { clientsClaim } from 'workbox-core'
import { type MessagePayload } from 'firebase/messaging'

self.skipWaiting()
  .catch(e => {
    console.error(e)
  })

clientsClaim()

console.log('firebase-messaging-sw init with skipWaiting')

const app = initializeApp({
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASURMENT_ID,
})

const messaging = getMessaging(app)

onBackgroundMessage(messaging, showBackgroundMessage)

self.addEventListener('notificationclick', (event) => {
  event.notification.close() // Android needs explicit close
  const path = urlFromMessage(event.notification.data)
  const url = [
    self.origin,
    path,
  ].filter(x => x)
    .join('/#/')
  console.log('notificationclick', url)
  event.waitUntil(self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(async windowClients => {
      const opened = windowClients.find(client => {
        return client.url.startsWith(self.origin) && 'focus' in client
      })
      if (opened) {
        if (path && opened.url !== url) {
          await opened.navigate(url)
        }
        return opened.focus()
      }

      return self.clients.openWindow(url)
    }),
  )
})


function showBackgroundMessage(payload: MessagePayload) {
  showMessage(payload, self.registration)
}
