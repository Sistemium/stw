import ReactiveModel from 'sistemium-data-vue'
import type StoreAdapterType from 'sistemium-data/types/StoreAdapter'
import { StoreAdapter } from 'sistemium-data'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { PAGE_SIZE_HEADER } from 'sistemium-data'

const PAGE_SIZE = parseInt(import.meta.env.VITE_PAGE_SIZE || '1000', 10)
const storeAdapter: StoreAdapterType = new StoreAdapter()
type Axios = typeof axios

export interface RelationsConfig {
  [relationName: string]: string
}

export interface ComputedConfig {
  [getterName: string]: (adapter: StoreAdapterType) => any
}

export interface HydratedModelConfig {
  collection: string
  schema: Record<string, any>
  relations?: RelationsConfig
  computed?: ComputedConfig
}

export type ScalarType = string | boolean | number | null | Date

export type ModelInstanceValue = ScalarType | ScalarType[]

interface RequestOptions extends Record<string, any> {
  headers?: Record<string, any> & {
    [PAGE_SIZE_HEADER]?: number
  }
}

interface FindByManyOptions extends RequestOptions {
  cached?: boolean
  field?: string
  chunkSize?: number
}

export default class HydratedModel<
  T extends Record<string, ModelInstanceValue>,
  HT extends T = T
> extends ReactiveModel {
  private relations: RelationsConfig
  private computed: ComputedConfig

  constructor(config: HydratedModelConfig) {
    super(config)
    this.relations = config.relations || {}
    this.computed = config.computed || {}
    storeAdapter.setupModel(this.collection, this)
  }

  hydrate(instance: T): HT {
    const { relations, computed } = this
    const result = { ...instance }
    Object.keys(relations).forEach(key => {
      const parentName = relations[key]
      const parent = storeAdapter.getStoreModel(parentName) as HydratedModel<T>
      const propertyValue = instance[`${key}Id`] as string
      Object.defineProperty(result, key, {
        get() {
          return parent.hydratedGet(propertyValue)
        },
        enumerable: false,
      })
    })
    Object.keys(computed).forEach(key => {
      Object.defineProperty(result, key, {
        get() {
          return computed[key].call(this, storeAdapter)
        },
        enumerable: false,
      })
    })
    return result as HT
  }

  hydratedGet(id?: string | null): HT {
    const instance: T = this.reactiveGet(id)
    return instance && this.hydrate(instance)
  }

  hydratedFilter(filter: object | Function = {}): HT[] {
    return this.reactiveFilter(filter).map(instance => this.hydrate(instance))
  }

  reactiveFilter(filter?: object | Function): T[] {
    return super.reactiveFilter(filter) as T[]
  }

  findByID(resourceId: string, options?: object): Promise<T> {
    return super.findByID(resourceId, options) as Promise<T>
  }

  reactiveGet(id?: string | null): T {
    return super.reactiveGet(id as string) as T
  }

  createOne(props: Omit<T, 'id'>, options?: object): Promise<T> {
    return super.createOne(props, options) as Promise<T>
  }

  putAction(id: string, action: string, actionId: string, props: object): Promise<T> {
    // @ts-ignore
    const axios: Axios = this.axios()
    const config = this.requestConfig({ op: '' }) as AxiosRequestConfig
    return axios.put<any, T>(`${this.collection}/${id}/${action}/${actionId}`, props, config)
  }

  updateOne(props: Record<string, ModelInstanceValue>, options?: object): Promise<T> {
    return super.updateOne(props, options) as Promise<T>
  }

  findByMany(ids: Array<string>, options?: FindByManyOptions): Promise<T[]> {
    return super.findByMany(ids, options)
  }

  fetchAll(filter?: object, options: RequestOptions = {}): Promise<T[]> {
    return super.fetchAll(filter, {
      ...options,
      headers: {
        [PAGE_SIZE_HEADER]: PAGE_SIZE,
        ...(options.headers || {}),
      },
    }) as Promise<T[]>
  }
}
