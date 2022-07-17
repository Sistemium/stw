// import log from 'sistemium-debug';
import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import Article from '@/models/Article';
import StockTaking from '@/models/StockTaking';
import StockTakingItem from '@/models/StockTakingItem';
import Storage from '@/models/Storage';

// const { debug } = log('initData');

// eslint-disable-next-line import/prefer-default-export
export async function initData() {
  // debug('start');
  await ArticleProp.findAll();
  await PropOption.findAll();
  await Article.findAll();
  await StockTakingItem.findAll();
  await Storage.findAll();
  await StockTaking.findAll();
}
