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
import { consigneeModel } from '@/services/warehousing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
// import StockWithdrawing from '@/models/StockWithdrawing';

const { error } = log('dataSync');

export async function initData() {
  // debug('start');
  await ArticleProp.findAll();
  await PropOption.findAll();
  await Article.findAll();
  await StockTakingItem.findAll();
  await Storage.findAll();
  await StockTaking.findAll();
  await Picture.findAll();
  // await StockWithdrawing.findAll();
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

  const { consigneeId, consigneeType } = record;
  if (!consigneeId || !consigneeType) {
    return;
  }

  const model = consigneeModel(consigneeType);

  if (!model.getByID(consigneeId)) {
    await model.findByID(consigneeId);
  }

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

  stockWithdrawingIdSync(to)
    .catch(e => error(e));
  next();

}
