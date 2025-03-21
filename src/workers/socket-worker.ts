import DataSocket from '@/lib/DataSocket'
import { notifyClients } from '@/workers/common-sw'
import { del, set, fetchEntity } from '@/workers/idb-worker'

interface ChangesPayload {
  collection: string
  fullDocument: Record<string, any>
}

export const socket = new DataSocket()
console.info('init socket-worker')

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
  .on('changes', (payload: ChangesPayload) => {
    fetchEntity(payload.collection)
      .then(() => {
        notifyClients({
          type: 'changes',
          payload,
        })
      })
      .catch((e: any) => {
        console.error(e)
      })
  })

export async function AUTH(event: ExtendableMessageEvent) {
  console.log('AUTH')
  socket.authorize(event.data.token)
  await set('authorization', event.data.token)
}

export async function LOG_OFF() {
  console.log('LOG_OFF')
  socket.disconnect()
  await del('authorization')
}
