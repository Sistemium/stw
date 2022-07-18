import stockTakingRoute from '@/router/stockTakingRoute';

export default {
  path: '/stockTakings',
  name: 'stockTakings',
  component: () => import(/* webpackChunkName: "stock" */ '../views/StockTakingsPage.vue'),
  props: {
    rootState: 'stockTakings',
    editRoute: 'stockTakingEdit',
    createRoute: 'stockTakingCreate',
    progressRoute: 'stockTakingProgress',
  },
  children: [
    {
      path: 'create',
      name: 'stockTakingCreate',
      props: {
        from: { name: 'stockTakings' },
        progressRoute: 'stockTakingProgress',
      },
      component: () => import('../components/stock/StockTakingEdit.vue'),
    },
    {
      path: 'edit/:stockTakingId',
      name: 'stockTakingEdit',
      props: ({ params: { stockTakingId } }) => ({
        stockTakingId,
        from: { name: 'stockTakings' },
        progressRoute: 'stockTakingProgress',
      }),
      component: () => import('../components/stock/StockTakingEdit.vue'),
    },
    stockTakingRoute,
  ],
};
