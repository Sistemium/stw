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
import find from 'lodash/find';
import { ElLoading } from 'element-plus';
import Model from '@/init/Model.js';
import type { RouteLocationNormalized as RouteRecord } from 'vue-router'
import { useInvStore } from '@/store/invStore';

const { error, debug } = log('dataSync');

type NextCallback = (redirect?: Partial<RouteRecord>) => Promise<void>

const initPromiseInfo: {
  resolve?: (value?: unknown) => void;
  reject?: () => void;
} = {};

const initPromise = new Promise((resolve, reject) => {
  initPromiseInfo.resolve = resolve;
  initPromiseInfo.reject = reject;
});

export function initGuard(to: RouteRecord, from: RouteRecord, next: NextCallback) {
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
  initPromiseInfo.resolve();
}

async function stockWithdrawingIdSync(to: RouteRecord, model: Model, positionsModel: Model, field: string) {

  const { [field]: stockOperationId } = to.params;
  if (!stockOperationId) {
    return;
  }

  await positionsModel.find({ [field]: stockOperationId });
  const record = await model.findByID(stockOperationId);

  if (!record) {
    return;
  }

  const { counterpartyId, counterpartyType } = record;
  if (!counterpartyId || !counterpartyType) {
    return;
  }

  const counterpartySource = counterpartyModel(counterpartyType);

  if (!counterpartySource.getByID(counterpartyId)) {
    await counterpartySource.findByID(counterpartyId);
  }

}

interface SyncOptions {
  model: Model;
  positionsModel: Model;
  field: string;
}

async function stockWithdrawingSync(to: RouteRecord, from: RouteRecord, options: SyncOptions) {
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
      const counterpartySource = counterpartyModel(type);
      if (!counterpartySource) {
        error('stockWithdrawingSync:', 'wrong type', type);
        return null;
      }
      return counterpartySource.findByMany(map(items, 'counterpartyId'), { cached: true });
    });

    await Promise.all(filter(counterpartyPromises));
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
    await next();
    return;
  }

  if (!authorized) {
    await next({
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

  await next();

}

type LoaderFn = (to?: RouteRecord, from?: RouteRecord, next?: () => void) => Promise<void>

const LOADERS: Map<RegExp, LoaderFn> = new Map([
  [/Recipe/i, async () => {
    await Recipe.findAll()
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
]);

const LOADER_KEYS = Array.from(LOADERS.keys());

async function switchLoad(to: RouteRecord, from: RouteRecord) {
  const key = find(LOADER_KEYS, needLoading);

  if (key) {
    await LOADERS.get(key)(to, from);
  }

  function needLoading(re: RegExp) {
    return re.test(to.name as string) && !re.test(from.name as string);
  }
}
