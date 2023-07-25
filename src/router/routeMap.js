import RouteMapper from '@/lib/RouteMapper';
import Storage from '@/models/Storage';
import Article from '@/models/Article';
import ArticleProp from '@/models/ArticleProp';
import StockTaking from '@/models/StockTaking';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import StockReceiving from '@/models/StockReceiving';
import StockReceivingItem from '@/models/StockReceivingItem';
import articlePicturesRoute from '@/router/articlePicturesRoute';
import stockTakingRoute from '@/router/stockTakingRoute';
import stockOperationsRoute from '@/router/stockOperationsRoute';

import { initGuard } from '@/services/dataSync';
// import Recipe from '@/models/Recipe';

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
    config: stockOperationsRoute({
      rootState: 'stockWithdrawals',
      model: StockWithdrawing,
      positionsModel: StockWithdrawingItem,
      operationName: 'stockWithdrawing',
      counterpartyRole: 'consignee',
    }),
  },
  stockReceivals: {
    config: stockOperationsRoute({
      rootState: 'stockReceivals',
      model: StockReceiving,
      positionsModel: StockReceivingItem,
      operationName: 'stockReceiving',
      counterpartyRole: 'supplier',
    }),
  },
  stockPeriod: {
    component: () => import(/* webpackChunkName: "stock" */ '../views/StockPeriodPage.vue'),
    beforeEnter: initGuard,
  },
  stockMovementReport: {
    component: () => import(/* webpackChunkName: "stock" */ '../views/StockMovementReportPage.vue'),
    beforeEnter: initGuard,
    meta: {
      menuHidden: true,
    },
  },
  articles: {
    model: Article,
    component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlesPage.vue'),
    editing: () => import(/* webpackChunkName: "articles" */ '../components/catalogue/ArticleEdit.vue'),
    meta: {
      useScanner: true,
    },
    children: {
      gallery: articlePicturesRoute,
    },
  },
  // recipes: {
  //   model: Recipe,
  //   component: () => import(/* webpackChunkName: "stock" */ '../views/RecipesPage.vue'),
  //   editing:
  //   () => import(/* webpackChunkName: "stock" */ '../components/production/RecipeEdit.vue'),
  // },
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
