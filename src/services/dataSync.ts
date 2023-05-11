import log from 'sistemium-debug';
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
// import StockWithdrawingProduct from '@/models/StockWithdrawingProduct';
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

const { error, debug } = log('dataSync');

const initPromiseInfo: {
  resolve?: (value?: unknown) => void;
  reject?: () => void;
} = {};

const initPromise = new Promise((resolve, reject) => {
  initPromiseInfo.resolve = resolve;
  initPromiseInfo.reject = reject;
});

export function initGuard(to, from, next) {
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

async function stockWithdrawingIdSync(to, model, positionsModel, field) {

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

async function stockWithdrawingSync(to, from, options: SyncOptions) {
  const {
    model,
    positionsModel,
    field,
  } = options;

  const loading = ElLoading.service({});

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

export async function authGuard(to, from, next) {

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

const LOADERS: Map<RegExp, (to?: object, from?: object, next?: () => void) => Promise<void>> = new Map([
  [/Recipe/i, async () => { await Recipe.findAll() }],
  [/StockTaking/i, stockTakingSync],
  [/StockWithdraw/i, (to, from) => stockWithdrawingSync(to, from, {
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

async function switchLoad(to, from) {
  const key = find(LOADER_KEYS, needLoading);

  if (key) {
    await LOADERS.get(key)(to, from);
  }

  function needLoading(re) {
    return re.test(to.name) && !re.test(from.name);
  }
}
