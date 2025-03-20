import Dexie, { type EntityTable } from 'dexie'
import type { BackendOP, IDBRequest } from '@/lib/axiosIDB'
import qs from 'qs'
import pick from 'lodash/pick'
import forEach from 'lodash/forEach'

interface Setting {
  id: string
  value: string
}

export const db = new Dexie('stw-store') as Dexie & { setting: EntityTable<Setting, 'id'> }

console.log('Using Dexie v' + Dexie.semVer)

db.version(1).stores({
  settings: '',
})
db.version(2).stores({
  setting: 'id,value',
  settings: null,
})
db.version(3).stores({
  setting: 'id',
})

export function DATA(event: ExtendableMessageEvent) {
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

export async function get(key: string) {
  const setting = await db.setting.get(key)
  return setting?.value
}

export async function set(id: string, value: string) {
  return db.setting.put({ value, id })
}

export async function del(key: string) {
  return db.setting.delete(key)
}


const MethodMap = new Map<BackendOP, string>([
  ['find', 'GET'],
  ['findAll', 'GET'],
  ['update', 'PATCH'],
  ['destroy', 'DELETE'],
  ['create', 'POST'],
])

function filterJoin(input: (string | undefined)[], separator?: string): string {
  return input.filter(x => x).join(separator)
}

function requestFromBackend(request: IDBRequest, source: Client) {
  const params = request.params ? qs.stringify(request.params, { arrayFormat: 'brackets' }) : undefined
  const url = filterJoin([
    filterJoin([`/api/${request.entity}`, request.id], '/'),
    params?.toString(),
  ], '?')
  fetch(url, {
    method: MethodMap.get(request.type),
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...pick(request.headers, ['x-page-size', 'x-offset', 'authorization']),
    }),
    body: request.data && JSON.stringify(request.data),
  })
    .then(async res => {
      const { status } = res
      const headers: Record<string, string> = {}
      forEach(['x-page-size', 'x-offset'], key => {
        const val = res.headers.get(key)
        if (val) {
          headers[key] = val
        }
      })
      if (status === 200) {
        source.postMessage({
          requestId: request.requestId,
          type: 'IDB-RESPONSE',
          data: await res.json(),
          headers,
        })
      }
      if (status === 204) {
        source.postMessage({
          requestId: request.requestId,
          type: 'IDB-RESPONSE',
          headers,
        })
      }
      throw Error(res.statusText)
    })
    .catch(e => {
      source.postMessage({
        requestId: request.requestId,
        type: 'IDB-RESPONSE',
        error: e.message,
      })
    })
}
