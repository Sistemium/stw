import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { showMessage } from '@/services/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASURMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)
export { getToken }

export function initMessaging() {
  if (!navigator.serviceWorker?.ready) {
    return
  }
  navigator.serviceWorker.ready.then(registration => {
    onMessage(messaging, payload => {
      const id = payload.data?.id
      console.log('foreground:message', self.location?.href)
      if (id && self.location?.href.match(new RegExp(id))) {
        return
      }
      return showMessage(payload, registration)
    })
  })
}
