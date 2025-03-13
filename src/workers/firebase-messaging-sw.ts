/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import { clientsClaim } from 'workbox-core'

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

onBackgroundMessage(messaging, (payload) => {
  if (!payload.notification) {
    return
  }
  const { title } = payload.notification

  if (!title) {
    return
  }

  const options = {
    body: payload.notification.body,
    data: payload.fcmOptions?.link,
  }

  self.registration.showNotification(title, options)
    .catch((e: any) => {
      console.error(e)
    })

})

self.addEventListener('notificationclick', (event) => {
  event.notification.close() // Android needs explicit close
  const { data } = event.notification
  const url = [
    self.origin,
    data,
  ].filter(x => x)
    .join('/')
  event.waitUntil(self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(windowClients => {
      const opened = windowClients.find(client => {
        return client.url.startsWith(self.origin) && 'focus' in client
      })
      if (opened) {
        return (data && opened.url !== url) ? opened.navigate(url) : opened.focus()
      }

      return self.clients.openWindow(url)
    }),
  )
})
