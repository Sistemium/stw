import { showMessage, urlFromMessage } from '@/services/messaging'
import { clientsClaim } from 'workbox-core'
import { type MessagePayload } from 'firebase/messaging'
import { socket } from '@/workers/socket-worker'
import { del, get, requestFromBackend, set } from '@/workers/idb-worker'
import { notifyClients, worker } from '@/workers/common-sw'

worker().skipWaiting()
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

console.log('service worker init')

clientsClaim()

worker().addEventListener('push', (event) => {
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
  event.waitUntil(showMessage(getPayload(), worker().registration))
})

worker().addEventListener('notificationclick', (event) => {
  event.notification.close() // Android needs explicit close
  // console.log('notificationClick', event.notification.data, self.origin)
  const path = urlFromMessage(event.notification.data)
  const url = [
    self.origin,
    path,
  ].filter(x => x)
    .join('/#/')
  event.waitUntil(worker().clients
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

      return worker().clients.openWindow(url)
    }),
  )
})

worker().addEventListener('message', event => {
  switch (event.data?.type) {
    case 'AUTH': {
      console.log('AUTH')
      socket.authorize(event.data.token)
      set('authorization', event.data.token)
        .catch(e => {
          console.error(e)
        })
      return
    }
    case 'LOG_OFF': {
      console.log('LOG_OFF')
      del('authorization')
        .catch(e => {
          console.error(e)
        })
      socket.disconnect()
      return
    }
    case 'DATA': {
      // console.log('DATA', event.data.params)
      const requestId: string = event.data.params?.requestId
      if (!requestId) {
        console.error('empty requestId')
        return
      }
      if (!event.source) {
        console.error('empty source')
        return
      }
      requestFromBackend(event.data.params, event.source as Client)
    }
  }
})
