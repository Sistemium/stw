import type { BackendOP, IDBRequest, IDBResponse } from '@/lib/axiosIDB'
import qs from 'qs'
import pick from 'lodash/pick'
import { db } from './stores'
import {
  OFFSET_HEADER,
  PAGE_SIZE_HEADER,
  OFFSET_FIELD,
  PAGE_SIZE_DEFAULT, notifyClients,
} from '@/workers/common-sw'
import { eachSeries } from 'async'

type BackendData = Record<string, any> | Record<string, any>[]

function hasTable(name: string) {
  try {
    return db.table(name)
  } catch (e) {
    return undefined
  }
}

async function saveData(entity: string, data?: BackendData) {
  if (!data) {
    return
  }
  const table = hasTable(entity)
  if (!table) {
    return
  }
  if (Array.isArray(data)) {
    await table.bulkPut(data)
  } else {
    await table.put(data)
  }
}

function isEmpty(params?: Record<string, any>) {
  return !Object.keys(params || {}).length
}

export async function DATA(event: ExtendableMessageEvent) {
  const requestId: string = event.data.params?.requestId
  const { source } = event
  if (!requestId) {
    console.error('empty requestId')
    return
  }
  if (!source) {
    console.error('empty source')
    return
  }
  const request = event.data.params as IDBRequest
  const {
    [OFFSET_HEADER]: offset,
    [PAGE_SIZE_HEADER]: pageSize = PAGE_SIZE_DEFAULT,
  } = request.headers

  const limit = Number(pageSize)
  const useOffset = isEmpty(request.params) && offset
  const savedOffset = useOffset && await getSavedOffset(request.entity)

  if (savedOffset > useOffset) {
    const saved = await findManyByOffset(request.entity, offset, limit)
    if (saved?.length) {
      return reply({
        data: saved,
        headers: {
          [PAGE_SIZE_HEADER]: limit,
          [OFFSET_HEADER]: tsToOffset(saved[saved.length - 1][OFFSET_FIELD]),
        },
      })
    }
  }

  const backend = await requestFromBackend(request)

  if (useOffset) {
    if (request.type === 'destroy' && request.id) {
      if ([204, 404, 200].includes(backend.status)) {
        await hasTable(request.entity)?.delete(request.id)
        backend.status = 204
      }
    } else if (backend.status === 200) {
      await saveData(request.entity, backend.data)
    }
    if (useOffset && [204, 200].includes(backend.status)) {
      await saveOffset(request.entity, backend.headers[OFFSET_HEADER])
    }
  }

  reply(backend)

  function reply(params: Partial<IDBResponse>) {
    source?.postMessage({
      requestId: request.requestId,
      type: 'IDB-RESPONSE',
      headers: {},
      ...params,
    })
  }
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

function requestHeaders(request: { headers: Record<string, any> }) {
  return new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...pick(request.headers, ['x-page-size', 'x-offset', 'authorization']),
  })
}

interface BackendResponse {
  data?: BackendData
  headers: Record<string, string>
  error?: string
  status: number
}

async function requestFromBackend(request: IDBRequest): Promise<BackendResponse> {
  return fetchBackend({
    method: MethodMap.get(request.type) || 'GET',
    ...request,
  })
}

interface BackendQuery {
  method: string
  entity: string
  id?: string
  params?: Record<string, any>
  headers: Record<string, any>
  data?: any
}

export async function fetchEntity(entity: string) {
  const offset = await getSavedOffset(entity)
  const authorization = await get('authorization')
  if (!offset || !authorization) {
    return []
  }
  const { data, headers } = await fetchBackend({
    method: 'GET',
    entity,
    headers: {
      [OFFSET_HEADER]: offset,
      [PAGE_SIZE_HEADER]: PAGE_SIZE_DEFAULT,
      authorization,
    },
  })
  const newOffset = headers[OFFSET_HEADER]
  if (newOffset) {
    await saveOffset(entity, newOffset)
  }
  if (!data?.length) {
    return []
  }
  await saveData(entity, data)
  return data
}

export async function processDeleted(deletes: Record<string, any>) {
  await eachSeries(deletes, async (doc: Record<string, any>) => {
    const { name, objectXid } = doc
    if (name === '*') {
      await rebuild()
      throw Error('rebuild:done')
    }
    if (!objectXid || !name) {
      return
    }
    await hasTable(name)?.delete(objectXid)
    notifyClients({ type: 'changes', payload: { collection: 'RecordStatus', fullDocument: doc } })
  })
}

async function rebuild() {
  const tables = db.tables.filter(t => /^[A-Z]/.test(t.name))
  await eachSeries(tables, async ({ name }) => {
    await db.table(name).clear()
  })
  await db.offset.clear()
  notifyClients({ type: 'reload' })
}

async function fetchBackend(query: BackendQuery): Promise<BackendResponse> {
  const params = query.params ? qs.stringify(query.params, { arrayFormat: 'brackets' }) : undefined
  const url = filterJoin([
    filterJoin([`/api/${query.entity}`, query.id], '/'),
    params?.toString(),
  ], '?')

  try {
    const res = await fetch(url, {
      method: query.method,
      headers: requestHeaders(query),
      body: query.data && JSON.stringify(query.data),
    })
    const { status } = res
    const headers: Record<string, string> = {}
    ;[PAGE_SIZE_HEADER, OFFSET_HEADER].forEach(key => {
      const val = res.headers.get(key)
      if (val) {
        headers[key] = val
      }
    })
    if (status === 200) {
      const data = await res.json()
      return { data, headers, status }
    } else if (status === 204) {
      return { headers, status }
    } else if (status === 400) {
      return { headers, error: await res.text(), status }
    }
    return { error: res.statusText, headers, status }
  } catch (e: any) {
    return { error: e.message, headers: {}, status: 500 }
  }
}

async function findManyByOffset(entity: string, offset: string, limit: number) {
  return hasTable(entity)
    ?.where(OFFSET_FIELD)
    .above(offsetToTs(offset))
    .limit(limit)
    .toArray()
}

function offsetToTs(offset: string) {
  return offset.replace(/^2-/, '')
}

function tsToOffset(ts: string) {
  return `2-${ts}`
}

async function saveOffset(entity: string, offset: string) {
  await db.offset.put({ entity, offset })
}

async function getSavedOffset(entity: string) {
  const saved = await db.offset.get(entity)
  if (!saved && entity === 'RecordStatus') {
    return '*'
  }
  return saved?.offset
}
