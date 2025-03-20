import log from 'sistemium-debug'
import { settle } from 'sistemium-data/lib/util/axios'
import { BaseItem, ModelRequestConfig } from 'sistemium-data'
import pick from 'lodash/pick'

const {
  debug,
  error,
} = log('axios:idb')

export const OFFSET_HEADER = 'x-offset'
export const PAGE_SIZE_HEADER = 'x-page-size'

let REQUEST_ID = 0

export type BackendOP = 'findAll' | 'find' | 'update' | 'destroy' | 'create'

const OP_TYPES = new Map<string, BackendOP>([
  ['findMany', 'findAll'],
  ['findOne', 'find'],
  ['createOne', 'create'],
  ['update', 'update'],
  ['updateOne', 'update'],
  ['deleteOne', 'destroy'],
])

export interface IDBRequest {
  requestId: number
  type: BackendOP,
  entity: string
  headers: Record<string, any>
  id?: string
  data?: Record<string, any>
  params?: BaseItem
}

export default async function(config: ModelRequestConfig) {

  let data: any
  let status = 200
  let statusText = 'OK'
  let headers = {}

  REQUEST_ID += 1

  try {
    const response = await main(config, REQUEST_ID)
    data = response.data
    headers = response.headers || {}
  } catch (e: any) {
    status = 503
    statusText = e.message
    error(e.message)
  }

  return new Promise((resolve, reject) => {
    settle(resolve, reject, {
      data,
      status,
      headers,
      statusText,
      config,
    })
  })

}


async function main(config: ModelRequestConfig, requestId: number) {

  const {
    op,
    headers = {},
    resourceId,
    params,
    collection,
    data: requestData,
  } = config

  const type = OP_TYPES.get(op)

  const etc = [resourceId, Object.keys(params).length && params, headers[OFFSET_HEADER], requestData]
  debug('req:', requestId, collection, op, ...etc.filter(x => x))

  if (!type) {
    throw new Error(`Unknown type for op ${op}`)
  }


  const res = await requestFromWorker({
    requestId,
    type,
    entity: collection,
    headers: pick(headers, [PAGE_SIZE_HEADER, OFFSET_HEADER, 'authorization']),
    id: resourceId,
    data: requestData,
    params,
  })

  debug('res:', requestId, collection, op, res.data?.length)
  return res

}

interface WorkerSuccessResponse {
  data?: BaseItem | BaseItem[]
  headers?: BaseItem
}

interface Resolver {
  resolve(response: WorkerSuccessResponse): void

  reject(err: any): void
}

const MESSAGES = new Map<number, Resolver>()

function requestFromWorker(params: IDBRequest): Promise<WorkerSuccessResponse> {
  return new Promise((resolve, reject) => {
    MESSAGES.set(params.requestId, { resolve, reject })
    navigator.serviceWorker.controller?.postMessage({ type: 'DATA', params })
  })
}

interface IDBResponse {
  type: string
  requestId: number
  data?: BaseItem | BaseItem[]
  error: string
  headers: BaseItem
}

navigator.serviceWorker.addEventListener('message', (event) => {
  const { requestId, type, error, data, headers }: IDBResponse = event.data
  if (type !== 'IDB-RESPONSE') {
    return
  }
  const message = MESSAGES.get(requestId)
  MESSAGES.delete(requestId)
  if (error) {
    return message?.reject(Error(error))
  }
  message?.resolve({ data, headers })
})
