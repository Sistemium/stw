import DataSocket from '@/lib/DataSocket'
import { notifyClients } from '@/workers/common-sw'
import { del, set } from '@/workers/idb-worker'

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
  .on('changes', (payload) => {
    notifyClients({
      type: 'changes',
      payload,
    })
  })

export function AUTH(event: ExtendableMessageEvent) {
  console.log('AUTH')
  socket.authorize(event.data.token)
  set('authorization', event.data.token)
    .catch(e => {
      console.error(e)
    })
}

export function LOG_OFF() {
  console.log('LOG_OFF')
  del('authorization')
    .catch(e => {
      console.error(e)
    })
  socket.disconnect()
}
