import log from 'sistemium-debug';
import dayjs from 'dayjs';
import store from '@/store';
import Configuration from '@/models/Configuration';
import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import Article from '@/models/Article';
import StockTaking from '@/models/StockTaking';
import StockTakingItem from '@/models/StockTakingItem';
import Storage from '@/models/Storage';
import Picture from '@/models/Picture';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import StockArticleDate from '@/models/StockArticleDate';
import StockReceiving from '@/models/StockReceiving';
import StockReceivingItem from '@/models/StockReceivingItem';
import Recipe from '@/models/Recipe';
import { counterpartyModel } from '@/services/warehousing';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import { ElLoading } from 'element-plus';
import Model from '@/init/Model';
import { useInvStore } from '@/store/invStore';
import Pricing from '@/models/Pricing'
import ArticlePricing from '@/models/ArticlePricing'
import Employee from '@/models/Employee'
import ServicePointCustomer from '@/models/ServicePointCustomer'
import Site from '@/models/Site'
import { eachSeries } from 'async';
import ServiceTask from '@/models/ServiceTask'
import { loadRelation } from '@/services/util'
import type { NavigationGuardNext, RouteLocationNormalized as RouteRecord } from 'vue-router'
import type { CounterpartyType } from '@/models/StockOperations'
import ServiceTaskHistory from '@/models/ServiceTaskHistory'
import User from '@/models/User'

const { error, debug } = log('dataSync');

type NextCallback = NavigationGuardNext //(redirect?: Partial<RouteRecord>) => Promise<void>

const initPromiseInfo: {
  resolve?: (value?: unknown) => void;
  reject?: () => void;
} = {};

const initPromise = new Promise((resolve, reject) => {
  initPromiseInfo.resolve = resolve;
  initPromiseInfo.reject = reject;
});

export function initGuard(_to: RouteRecord, _from: RouteRecord, next: NextCallback) {
  initPromise.then(() => next());
}

export async function initData() {
  debug('initData');
  await Configuration.findAll();
  await ArticleProp.findAll();
  await PropOption.findAll();
  await Article.findAll();
  await Recipe.findAll();
  await Storage.findAll();
  await Picture.findAll();
  await Pricing.findAll();
  await Site.cachedFetch()
  initPromiseInfo.resolve?.call(initPromiseInfo);
}

async function stockWithdrawingIdSync(to: RouteRecord, model: Model, positionsModel: Model, field: string) {

  const { [field]: stockOperationId } = to.params;
  if (!stockOperationId) {
    return;
  }

  await positionsModel.find({ [field]: stockOperationId });
  const record: Record<string, any> = await model.findByID(stockOperationId as string);

  if (!record) {
    return;
  }

  const { counterpartyId, counterpartyType } = record;
  if (!counterpartyId || !counterpartyType) {
    return;
  }

  const counterpartySource = counterpartyModel(counterpartyType) as Model;

  if (!counterpartySource.getByID(counterpartyId)) {
    await counterpartySource.findByID(counterpartyId);
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
  } = options;

  const loading = ElLoading.service({});
  const store = useInvStore();

  try {
    const data = await model.findAll({});
    const ids = map(data, 'id');
    await positionsModel.findByMany(ids, { field, chunkSize: 70 });
    // if (field === 'stockWithdrawingId') {
    //   await StockWithdrawingProduct.findByMany(ids, { field });
    // }

    const byType = groupBy(filter(data, 'counterpartyType'), 'counterpartyType');
    const counterpartyPromises = map(byType, (items, type) => {
      const counterpartySource = counterpartyModel(type as CounterpartyType);
      if (!counterpartySource) {
        error('stockWithdrawingSync:', 'wrong type', type);
        return null;
      }
      return counterpartySource.findByMany(map(items, 'counterpartyId'), { cached: true });
    });

    await Promise.all(filter(counterpartyPromises));
    const { currentStorageId } = store
    if (currentStorageId) {
      await fetchStocks(currentStorageId);
    }
  } catch (e) {
    error('stockWithdrawingSync:', e);
  }

  loading.close();

  stockWithdrawingIdSync(to, model, positionsModel, field)
    .catch(error);

}

async function stockTakingSync() {
  await StockTakingItem.findAll();
  await StockTaking.findAll();
}

export async function authGuard(to: RouteRecord, from: RouteRecord, next: NextCallback) {

  const authorized = store.getters['auth/IS_AUTHORIZED'];

  if (to.meta.public) {
    next();
    return;
  }

  if (!authorized) {
    next({
      path: '/auth',
      query: {
        ...to.query,
        from: to.fullPath,
      },
    });
    return;
  }

  try {
    // debug('authGuard', to.name);
    await switchLoad(to, from);
  } catch (e) {
    error(e);
  }

  next();

}

type LoaderFn = (to: RouteRecord, from: RouteRecord, next?: () => void) => Promise<void>

const LOADERS: Map<RegExp, LoaderFn> = new Map([
  [/Recipe/i, async () => {
    await Recipe.findAll()
  }],
  [/articlePricing/i, async (to: RouteRecord) => {
    const { pricingId } = to.params
    if (pricingId) {
      await fetchArticlePricing(pricingId as string)
    }
    await Employee.cachedFetch()
  }],
  [/storages/i, async () => {
    await Employee.cachedFetch()
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
    const tasks = await ServiceTask.cachedFetch()
    await loadRelation(ServicePointCustomer, tasks, 'servicePointId')
    const history = await ServiceTaskHistory.cachedFetch()
    await loadRelation(User, history, 'authId')
    await loadRelation(User, tasks, 'creatorId')
    await Employee.cachedFetch()
  }],
]);

export async function fetchServiceTask(serviceTaskId: string) {
  const task = await ServiceTask.findOne({ serviceTaskId })
  if (!task) {
    return
  }
  await loadRelation(ServicePointCustomer, [task], 'servicePointId')
  const history = await ServiceTaskHistory.find({ serviceTaskId })
  await loadRelation(User, history, 'authId')
  await loadRelation(User, [task], 'creatorId')
  await Employee.cachedFetch()
}

const LOADER_KEYS = Array.from(LOADERS.keys());

async function switchLoad(to: RouteRecord, from: RouteRecord) {
  const keys = filter(LOADER_KEYS, needLoading);

  await eachSeries(keys, async key => {
    await LOADERS.get(key)?.call(null, to, from);
  })

  function needLoading(re: RegExp) {
    return re.test(to.name as string) && !re.test(from.name as string);
  }
}

export async function fetchStocks(storageId: string) {
  const date = dayjs().format('YYYY-MM-DD');
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
