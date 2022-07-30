// import log from 'sistemium-debug';
import store from '@/store';
import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import Article from '@/models/Article';
import StockTaking from '@/models/StockTaking';
import StockTakingItem from '@/models/StockTakingItem';
import Storage from '@/models/Storage';
import Picture from '@/models/Picture';
// import StockWithdrawing from '@/models/StockWithdrawing';

// const { debug } = log('initData');

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

export function authGuard(to, from, next) {

  const authorized = store.getters['auth/IS_AUTHORIZED'];

  if (authorized || to.meta.public) {
    next();
    return;
  }

  next({
    path: '/auth',
    query: {
      ...to.query,
      from: to.fullPath,
    },
  });

}
