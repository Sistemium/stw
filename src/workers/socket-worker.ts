import DataSocket from '@/lib/DataSocket'
import { notifyClients } from '@/workers/common-sw'

export const socket = new DataSocket()
console.warn('init socket-worker')

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


