import RouteMapper from '@/lib/RouteMapper';
import Storage from '@/models/Storage';
import Article from '@/models/Article';
import ArticleProp from '@/models/ArticleProp';
import StockTaking from '@/models/StockTaking';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import { itemRouteHelper } from '@/router/helpers';
import map from 'lodash/map';

import stockTakingRoute from './stockTakingRoute';

export default new RouteMapper({
  storages: {
    model: Storage,
    component: () => import(/* webpackChunkName: "stock" */ '../views/StoragesPage.vue'),
    editing: () => import(/* webpackChunkName: "stock" */ '../components/stock/StorageEdit.vue'),
  },
  stockTakings: {
    model: StockTaking,
    component: () => import(/* webpackChunkName: "stock" */ '../views/StockTakingsPage.vue'),
    editing: () => import(/* webpackChunkName: "stock" */ '../components/stock/StockTakingEdit.vue'),
    children: {
      progress: stockTakingRoute,
    },
    meta: {
      useScanner: true,
    },
  },
  stockWithdrawals: {
    model: StockWithdrawing,
    component: () => import(/* webpackChunkName: "out" */ '../views/StockWithdrawalsPage.vue'),
    create: () => import(/* webpackChunkName: "out" */ '../components/out/StockWithdrawingEdit.vue'),
    edit: {
      name: 'stockWithdrawing',
      model: StockWithdrawingItem,
      component: () => import(/* webpackChunkName: "out" */ '../views/StockWithdrawingPage.vue'),
      children: itemRouteHelper(/* webpackChunkName: "out" */ 'stockWithdrawing', () => import('../components/out/StockWithdrawingItemEdit.vue')),
    },
    async beforeEnter(to, from, next) {
      const data = await StockWithdrawing.findAll({});
      const ids = map(data, 'id');
      await StockWithdrawingItem.findByMany(ids, { field: 'stockWithdrawingId' });
      next();
    },
    meta: {
      useScanner: true,
    },
  },
  articles: {
    model: Article,
    component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlesPage.vue'),
    editing: () => import(/* webpackChunkName: "articles" */ '../components/catalogue/ArticleEdit.vue'),
    meta: {
      useScanner: true,
    },
  },
  articleProps: {
    model: ArticleProp,
    component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlePropsPage.vue'),
    editing: () => import(/* webpackChunkName: "articles" */ '../components/ArticlePropertyEdit.vue'),
  },
  about: {
    public: true,
    component: () => import(/* webpackChunkName: "public" */ '../views/AboutPage.vue'),
  },
});
