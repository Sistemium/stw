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
import StockReceiving from '@/models/StockReceiving';
import StockReceivingItem from '@/models/StockReceivingItem';
import { counterpartyModel } from '@/services/warehousing';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import Loading from 'element-ui/packages/loading';

const { error, debug } = log('dataSync');

export async function initData() {
  debug('initData');
  await Configuration.findAll();
  await ArticleProp.findAll();
  await PropOption.findAll();
  await Article.findAll();
  await StockTakingItem.findAll();
  await Storage.findAll();
  await StockTaking.findAll();
  await Picture.findAll();
}

export async function stockWithdrawingIdSync(to, model, positionsModel, field) {

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

async function stockWithdrawingSync(to, from, options) {
  const {
    re,
    model,
    positionsModel,
    field,
  } = options;

  if (!re.test(to.name) || re.test(from.name)) {
    return;
  }

  const loading = Loading.service({});

  try {
    const data = await model.findAll({});
    const ids = map(data, 'id');
    await positionsModel.findByMany(ids, { field });

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
    await stockWithdrawingSync(to, from, {
      re: /StockWithdraw/i,
      model: StockWithdrawing,
      positionsModel: StockWithdrawingItem,
      field: 'stockWithdrawingId',
    });
    await stockWithdrawingSync(to, from, {
      re: /StockReceiv/i,
      model: StockReceiving,
      positionsModel: StockReceivingItem,
      field: 'stockReceivingId',
    });
  } catch (e) {
    error(e);
  }

  next();

}
