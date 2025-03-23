import DataSocket from '@/lib/DataSocket'
import { notifyClients, worker } from '@/workers/common-sw'
import { set, fetchEntity, processDeleted } from '@/workers/idb-worker'
import { cleanup, db } from '@/workers/stores'

interface ChangesPayload {
  collection: string
  fullDocument: Record<string, any>
}

export const socket = new DataSocket()
console.info('init socket-worker')

socket
  .on('connect', () => {
    console.info('socket:connect')
    awake()
    notifyClients({ type: 'connect' })
    fetchEntity('RecordStatus')
      .then(processDeleted)
      .catch(e => {
        console.error(e)
      })
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
      .then(data => {
        if (payload.collection === 'RecordStatus') {
          return processDeleted(data)
        }
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
  db.open()
    .then(() => {
      socket.authorize(event.data.token)
      return set('authorization', event.data.token)
    })
}

export async function LOG_OFF() {
  console.log('LOG_OFF')
  socket.disconnect()
  await cleanup()
}

const STATE = {
  heartbeat: 0,
}

function awake() {
  if (STATE.heartbeat) {
    clearInterval(STATE.heartbeat)
  }
  STATE.heartbeat = setInterval(() => {
    worker().clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        if (!clients.length) {
          sleep()
        }
      })
  }, 60000)
}

function sleep() {
  console.warn('go:sleep')
  socket.disconnect()
  if (STATE.heartbeat) {
    clearInterval(STATE.heartbeat)
  }
}
