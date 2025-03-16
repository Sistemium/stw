import { type MessagePayload } from 'firebase/messaging'

export function showMessage(payload: MessagePayload, registration: ServiceWorkerRegistration) {
  const {
    notification,
    data,
  } = payload
  if (!notification) {
    return
  }
  const { title } = notification

  if (!title) {
    return
  }

  registration.showNotification(title, {
    body: notification.body,
    data,
  }).catch(e => {
    console.error(e)
  })

}

export function urlFromMessage(data?: Record<string, any>): string | undefined {
  if (!data) {
    return
  }
  const { entity, id } = data
  if (!id) {
    return
  }
  if (entity === 'ServiceTask') {
    return `serviceTasks/edit/${id}?tab=history`
  }
}
