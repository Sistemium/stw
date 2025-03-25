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
import Pricing from '@/models/Pricing'
import type { BaseItem } from '@/init/Model'
import ServiceTask from '@/models/ServiceTask'
import User from '@/models/User'

// import Recipe from '@/models/Recipe';

export default new RouteMapper({
  storages: {
    model: Storage,
    component: () => import(/* webpackChunkName: "stock" */ '../views/StoragesPage.vue'),
    editing: () => import(/* webpackChunkName: "stock" */ '../components/stock/StorageEdit.vue'),
    meta: {
      menuGroup: 'other',
    },
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
      menuGroup: 'other',
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
    component: () => import(/* webpackChunkName: "articles" */ '../views/StockPeriodPage.vue'),
    beforeEnter: initGuard,
    children: {
      gallery: articlePicturesRoute('stockPeriod'),
    },
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
      gallery: articlePicturesRoute('articles'),
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
    meta: {
      menuGroup: 'other',
    },
  },
  users: {
    model: User,
    component: () => import(/* webpackChunkName: "articles" */ '../views/UsersPage.vue'),
    editing: () => import(/* webpackChunkName: "articles" */ '../components/users/UserEdit.vue'),
    meta: {
      menuGroup: 'other',
      role: 'admin',
    },
  },
  pricing: {
    model: Pricing,
    component: () => import(/* webpackChunkName: "articles" */ '../views/PricingPage.vue'),
    editing: () => import(/* webpackChunkName: "articles" */ '../components/pricing/PricingEdit.vue'),
    children: {
      articlePricing: {
        name: `articlePricing`,
        path: ':pricingId/articles',
        props({ params: { pricingId } }: BaseItem) {
          return {
            from: { name: 'pricing' },
            pricingId,
          };
        },
        component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlePricingPage.vue'),
      },
    },
    meta: {
      menuGroup: 'other',
    },
  },
  about: {
    public: true,
    component: () => import(/* webpackChunkName: "public" */ '../views/AboutPage.vue'),
    meta: {
      menuGroup: 'other',
    },
  },
  serviceTasks: {
    model: ServiceTask,
    component: () => import(/* webpackChunkName: "tasks" */ '../views/ServiceTasksPage.vue'),
    editing: () => import(/* webpackChunkName: "tasks" */ '../components/tasks/ServiceTaskEdit.vue'),
  },
});
