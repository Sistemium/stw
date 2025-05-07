/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

export function worker(): ServiceWorkerGlobalScope {
  return self
}

export function notifyClients(message: ClientMessage) {
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

export interface ClientMessage extends Record<string, any> {
  type: string
}

export type MessageHandler<T = ExtendableMessageEvent> = (event: T) => Promise<void>
export const OFFSET_HEADER = 'x-offset'
export const PAGE_SIZE_HEADER = 'x-page-size'
export const OFFSET_FIELD = 'x_offset'
export const PAGE_SIZE_DEFAULT = '500'
