export default {
  path: '/stockTakings',
  name: 'stockTakings',
  component: () => import(/* webpackChunkName: "stock" */ '../views/StockTakingsPage.vue'),
  props: {
    editRoute: 'stockTakingEdit',
    createRoute: 'stockTakingCreate',
  },
  children: [
    {
      path: 'create',
      name: 'stockTakingCreate',
      props: {
        from: { name: 'stockTakings' },
      },
      component: () => import('../components/stock/StockTakingEdit.vue'),
    },
    {
      path: 'edit/:stockTakingId',
      name: 'stockTakingEdit',
      props: ({ params: { stockTakingId } }) => ({
        stockTakingId,
        from: { name: 'stockTakings' },
      }),
      component: () => import('../components/stock/StockTakingEdit.vue'),
    },
  ],
};
