import { type MessagePayload } from 'firebase/messaging'

export async function showMessage(payload: Partial<MessagePayload>, registration: ServiceWorkerRegistration): Promise<any> {
  const {
    notification,
    data,
  } = payload
  if (!notification) {
    return
  }
  // console.log('showMessage', notification, data)
  const { title } = notification

  if (!title) {
    return
  }

  return registration.showNotification(title, {
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
