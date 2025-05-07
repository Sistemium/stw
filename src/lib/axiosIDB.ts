import log from 'sistemium-debug'
import { settle } from 'sistemium-data/lib/util/axios'
import { BaseItem, ModelRequestConfig } from 'sistemium-data'
import pick from 'lodash/pick'
import { OFFSET_HEADER, PAGE_SIZE_HEADER } from '@/workers/common-sw'

const { debug } = log('axios:idb')

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
    status = response.status
    if (response.error) {
      statusText = response.error
      data = statusText
    }
  } catch (e: any) {
    status = 503
    statusText = e.message
    data = statusText
    console.error(e)
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

  const etc = [
    resourceId,
    Object.keys(params || {}).length && params,
    headers[OFFSET_HEADER],
    requestData,
  ]
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
    data: requestData && JSON.parse(JSON.stringify(requestData)),
    params,
  })

  debug('res:', requestId, collection, op, res.data?.length)
  return res

}

interface WorkerSuccessResponse {
  data?: BaseItem | BaseItem[]
  headers?: BaseItem
  status: number
  error?: string
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

export interface IDBResponse {
  type: string
  requestId: number
  data?: BaseItem | BaseItem[]
  error: string
  headers: BaseItem
  status: number
}

const HANDLERS: Record<string, (e: MessageEvent) => void> = {
  ['IDB-RESPONSE'](event) {
    const { requestId, error, data, headers, status }: IDBResponse = event.data
    const message = MESSAGES.get(requestId)
    MESSAGES.delete(requestId)
    // if (error) {
    //   return message?.reject(Error(error))
    // }
    message?.resolve({ data, headers, status, error })
  },
}

navigator.serviceWorker.addEventListener('message', (event) => {
  const type: string = event.data?.type
  if (type) {
    HANDLERS[type]?.call(null, event)
  }
})
