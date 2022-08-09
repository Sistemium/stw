import log from 'sistemium-debug';
import store from '@/store';
import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import Article from '@/models/Article';
import StockTaking from '@/models/StockTaking';
import StockTakingItem from '@/models/StockTakingItem';
import Storage from '@/models/Storage';
import Picture from '@/models/Picture';
import StockWithdrawing from '@/models/StockWithdrawing';
import { counterpartyModel } from '@/services/warehousing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import Loading from 'element-ui/packages/loading';

const { error, debug } = log('dataSync');

export async function initData() {
  debug('initData');
  await ArticleProp.findAll();
  await PropOption.findAll();
  await Article.findAll();
  await StockTakingItem.findAll();
  await Storage.findAll();
  await StockTaking.findAll();
  await Picture.findAll();
}

export async function stockWithdrawingIdSync(to) {

  const { stockWithdrawingId } = to.params;
  if (!stockWithdrawingId) {
    return;
  }

  await StockWithdrawingItem.find({ stockWithdrawingId });
  const record = await StockWithdrawing.findByID(stockWithdrawingId);

  if (!record) {
    return;
  }

  const { counterpartyId, counterpartyType } = record;
  if (!counterpartyId || !counterpartyType) {
    return;
  }

  const model = counterpartyModel(counterpartyType);

  if (!model.getByID(counterpartyId)) {
    await model.findByID(counterpartyId);
  }

}

async function stockWithdrawingSync(to, from) {

  const re = /StockWithdraw/i;

  if (!re.test(to.name) || re.test(from.name)) {
    return;
  }

  const loading = Loading.service({});

  try {
    const data = await StockWithdrawing.findAll({});
    const ids = map(data, 'id');
    await StockWithdrawingItem.findByMany(ids, { field: 'stockWithdrawingId' });

    const byType = groupBy(filter(data, 'counterpartyType'), 'counterpartyType');
    const counterpartyPromises = map(byType, (items, type) => {
      const model = counterpartyModel(type);
      if (!model) {
        error('stockWithdrawingSync:', 'wrong type', type);
        return null;
      }
      return model.findByMany(map(items, 'counterpartyId'), { cached: true });
    });

    await Promise.all(filter(counterpartyPromises));
  } catch (e) {
    error('stockWithdrawingSync:', e);
  }

  loading.close();

  stockWithdrawingIdSync(to)
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
    await stockWithdrawingSync(to, from);
  } catch (e) {
    error(e);
  }

  next();

}
