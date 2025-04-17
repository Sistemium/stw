import log from 'sistemium-debug'
import dayjs from 'dayjs'
import store from '@/store'
import Configuration from '@/models/Configuration'
import ArticleProp from '@/models/ArticleProp'
import PropOption from '@/models/PropOption'
import Article from '@/models/Article'
import StockTaking from '@/models/StockTaking'
import StockTakingItem from '@/models/StockTakingItem'
import Storage from '@/models/Storage'
import Picture from '@/models/Picture'
import StockWithdrawing from '@/models/StockWithdrawing'
import StockWithdrawingItem from '@/models/StockWithdrawingItem'
import StockArticleDate from '@/models/StockArticleDate'
import StockReceiving from '@/models/StockReceiving'
import StockReceivingItem from '@/models/StockReceivingItem'
import Recipe from '@/models/Recipe'
import { counterpartyModel } from '@/services/warehousing'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import filter from 'lodash/filter'
import { ElLoading } from 'element-plus'
import Model from '@/init/Model'
import { useInvStore } from '@/store/invStore'
import Pricing from '@/models/Pricing'
import ArticlePricing from '@/models/ArticlePricing'
import Employee from '@/models/Employee'
import ServicePointCustomer from '@/models/ServicePointCustomer'
import Site from '@/models/Site'
import { eachSeries } from 'async'
import ServiceTask from '@/models/ServiceTask'
import { filterJoin, loadRelation } from '@/services/util'
import type { NavigationGuardNext, RouteLocationNormalized as RouteRecord } from 'vue-router'
import type { CounterpartyType } from '@/models/StockOperations'
import ServiceTaskHistory from '@/models/ServiceTaskHistory'
import User from '@/models/User'
import { subscribeChanges } from '@/services/socket'
import syncDeletions from '@/services/syncDeletions'
import ClientData, { type IClientData } from '@/models/ClientData'
import DeviceDetector from 'device-detector-js'
import matchesDeep from 'sistemium-data/lib/util/matchesDeep'
import { getLocale } from '@/i18n'
import packageJson from '../../package.json'
import { computed } from 'vue'

const { error, debug } = log('dataSync')
const { VITE_MASTER_PRICING } = import.meta.env

type NextCallback = NavigationGuardNext //(redirect?: Partial<RouteRecord>) => Promise<void>

const initPromiseInfo: {
  resolve?: (value?: unknown) => void;
  reject?: () => void;
} = {}

const initPromise = new Promise((resolve, reject) => {
  initPromiseInfo.resolve = resolve
  initPromiseInfo.reject = reject
})

export function initGuard(_to: RouteRecord, _from: RouteRecord, next: NextCallback) {
  initPromise.then(() => next())
}

export async function initData() {
  debug('initData')
  await updateClientData()
  await Configuration.fetchSubscribed()
  await ArticleProp.fetchSubscribed()
  await PropOption.fetchSubscribed()
  await Article.fetchSubscribed()
  // await Recipe.findAll()
  await Storage.fetchSubscribed()
  await Picture.fetchSubscribed()
  await Pricing.fetchSubscribed()
  await Site.fetchSubscribed()
  initPromiseInfo.resolve?.call(initPromiseInfo)
  syncDeletions()
}

async function updateClientData() {
  const store = useInvStore()
  const existing = await ClientData.findOne({ id: store.clientDataId })
  const deviceDetector = new DeviceDetector()
  const deviceInfo = deviceDetector.parse(navigator.userAgent)
  const data: Partial<IClientData> = {
    id: store.clientDataId,
    authId: store.authId,
    deviceInfo,
    locale: getLocale(),
    devicePlatform: filterJoin([deviceInfo.device?.brand, deviceInfo.os?.name], ' '),
    systemVersion: deviceInfo.os?.version,
    buildType: window.location.port ? 'DEBUG' : 'RELEASE',
    bundleVersion: packageJson.version,
    appVersion: packageJson.version,
    bundleIdentifier: window.origin,
    deviceName: filterJoin([deviceInfo.client?.name, deviceInfo.client?.version], ' '),
  }
  if (matchesDeep(data, existing)) {
    return
  }
  await ClientData.updateOne(data)
}

export function useClientData() {
  const store = useInvStore()
  const clientData = computed(() => ClientData.reactiveGet(store.clientDataId))
  return {
    clientData,
    async updatePushToken(deviceToken?: string | null) {
      return ClientData.updateOne({
        id: store.clientDataId,
        deviceToken,
      })
    },
  }
}

async function stockWithdrawingIdSync(to: RouteRecord, model: Model, positionsModel: Model, field: string) {

  const { [field]: stockOperationId } = to.params
  if (!stockOperationId) {
    return
  }

  await positionsModel.find({ [field]: stockOperationId })
  const record: Record<string, any> = await model.findByID(stockOperationId as string)

  if (!record) {
    return
  }

  const { counterpartyId, counterpartyType } = record
  if (!counterpartyId || !counterpartyType) {
    return
  }

  const counterpartySource = counterpartyModel(counterpartyType) as Model

  if (!counterpartySource.getByID(counterpartyId)) {
    await counterpartySource.findByID(counterpartyId)
  }

}

interface SyncOptions {
  model: Model;
  positionsModel: Model;
  field: string;
}

async function stockWithdrawingSync(to: RouteRecord, _from: RouteRecord, options: SyncOptions) {
  const {
    model,
    positionsModel,
    field,
  } = options

  const loading = ElLoading.service({})
  const store = useInvStore()

  async function fetchModel() {
    const { currentStorageId } = store
    const loaded = !!model.reactiveManyByIndex('storageId', currentStorageId).length
    const data = await model.cachedFetch({ storageId: currentStorageId })
    const ids = map(data, 'id')

    await positionsModel.findByMany(ids, { field, chunkSize: 70 })
      .then(positions => {
        if (!loaded) {
          return
        }
        const byId = groupBy(positions, 'id')
        ids.forEach(id => {
          positionsModel.reactiveManyByIndex(field, id)
            .forEach(({ id }) => {
              if (!byId[id]) {
                positionsModel.eject(id)
              }
            })
        })
      })

    // if (field === 'stockWithdrawingId') {
    //   await StockWithdrawingProduct.findByMany(ids, { field });
    // }

    const byType = groupBy(filter(data, 'counterpartyType'), 'counterpartyType')
    const counterpartyPromises = map(byType, (items, type) => {
      const counterpartySource = counterpartyModel(type as CounterpartyType)
      if (!counterpartySource) {
        error('stockWithdrawingSync:', 'wrong type', type)
        return null
      }
      return counterpartySource.findByMany(map(items, 'counterpartyId'), { cached: true })
    })

    await Promise.all(filter(counterpartyPromises))
    if (currentStorageId) {
      await fetchStocks(currentStorageId)
    }
  }

  try {
    await subscribeChanges(model.collection, fetchModel)
    await subscribeChanges(positionsModel.collection, async (fullDocument) => {
      if (!fullDocument) {
        return
      }
      const parentId = fullDocument[field]
      const parent = model.getByID(parentId)
      if (!parent) {
        return
      }
      await positionsModel.findOne({ id: fullDocument.id })
    })
  } catch (e) {
    error('stockWithdrawingSync:', e)
  }

  loading.close()

  stockWithdrawingIdSync(to, model, positionsModel, field)
    .catch(error)

}

async function stockTakingSync() {
  await StockTakingItem.fetchSubscribed()
  await StockTaking.fetchSubscribed()
}

export async function authGuard(to: RouteRecord, from: RouteRecord, next: NextCallback) {

  const authorized = store.getters['auth/IS_AUTHORIZED']

  const { role: needRole, public: isPublic } = to.meta

  if (isPublic) {
    next()
    return
  }

  if (!authorized) {
    next({
      path: '/auth',
      query: {
        ...to.query,
        from: to.fullPath,
      },
    })
    return
  }

  if (needRole) {
    const store = useInvStore()
    if (!store.user) {
      await store.initUser()
    }
    if (!store.hasRole(needRole as string)) {
      return next({ path: '/' })
    }
  }

  try {
    // debug('authGuard', to.name);
    await switchLoad(to, from)
  } catch (e) {
    error(e)
  }

  next()

}

type LoaderFn = (to: RouteRecord, from: RouteRecord, next?: () => void) => Promise<void>

const LOADERS: Map<RegExp, LoaderFn> = new Map([
  [/Recipe/i, async () => {
    await Recipe.cachedFetch()
  }],
  [/articlePricing/i, async (to: RouteRecord) => {
    const { pricingId } = to.params
    if (pricingId) {
      await fetchArticlePricing(pricingId as string)
    }
    await subscribeChanges('Employee', fetchEmployees)
  }],
  [/storages/i, async () => {
    await subscribeChanges('Employee', fetchEmployees)
  }],
  [/StockTaking/i, stockTakingSync],
  [/StockWithdraw/i, (to: RouteRecord, from: RouteRecord) => stockWithdrawingSync(to, from, {
    model: StockWithdrawing,
    positionsModel: StockWithdrawingItem,
    field: 'stockWithdrawingId',
  })],
  [/StockReceiv/i, (to, from) => stockWithdrawingSync(to, from, {
    model: StockReceiving,
    positionsModel: StockReceivingItem,
    field: 'stockReceivingId',
  })],
  [/serviceTask/, async () => {
    await subscribeChanges(['ServiceTask', 'ServiceTaskHistory'], fetchServiceTasks)
    await subscribeChanges('Employee', fetchEmployees)
    await subscribeChanges('ArticlePricing', () => fetchArticlePricing(VITE_MASTER_PRICING))
  }],
  [/users?/, async () => {
    await User.fetchSubscribed()
    await Employee.fetchSubscribed()
  }],
])

async function fetchEmployees() {
  await Employee.cachedFetch()
}

export async function fetchServiceTasks() {
  const tasks = await ServiceTask.cachedFetch()
  await loadRelation(ServicePointCustomer, tasks, 'servicePointId')
  // TODO: fetch only related history
  const history = await ServiceTaskHistory.cachedFetch()
  await loadRelation(User, history, 'authId')
  await loadRelation(User, tasks, 'creatorId')
}

export async function fetchServiceTask(serviceTaskId: string) {
  const task = await ServiceTask.findOne({ serviceTaskId })
  if (!task) {
    return
  }
  await loadRelation(ServicePointCustomer, [task], 'servicePointId')
  const history = await ServiceTaskHistory.find({ serviceTaskId })
  await loadRelation(User, history, 'authId')
  await loadRelation(User, [task], 'creatorId')
}

const LOADER_KEYS = Array.from(LOADERS.keys())

async function switchLoad(to: RouteRecord, from: RouteRecord) {
  const keys = filter(LOADER_KEYS, needLoading)

  await eachSeries(keys, async key => {
    await LOADERS.get(key)?.call(null, to, from)
  })

  function needLoading(re: RegExp) {
    return re.test(to.name as string) && !re.test(from.name as string)
  }
}

export async function fetchStocks(storageId: string) {
  const date = dayjs().format('YYYY-MM-DD')
  await StockArticleDate.cachedFetch({
    storageId,
    date: { $lte: date },
    nextDate: { $gt: date },
  })
}

export async function fetchArticlePricing(pricingId: string) {
  // const date = dayjs().format('YYYY-MM-DD');
  await ArticlePricing.cachedFetch({
    pricingId,
    // date: { $lte: date },
    // nextDate: { $gt: date },
  })
}
