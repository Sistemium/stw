export default {
  path: 'progress/:stockTakingId',
  name: 'stockTakingProgress',
  meta: {
    useScanner: true,
    menuHidden: true,
  },
  component: () => import('../views/StockTakingPage.vue'),
  props({ params: { stockTakingId } }) {
    return {
      stockTakingId,
      editItemRoute: 'stockTakingItemEdit',
      createItemRoute: 'stockTakingItemCreate',
    };
  },
  children: [
    {
      path: 'create',
      name: 'stockTakingItemCreate',
      props: ({ params: { stockTakingId } }) => ({
        stockTakingId,
        from: { name: 'stockTakingProgress' },
      }),
      component: () => import('../components/stock/StockTakingItemEdit.vue'),
    },
    {
      path: 'editItem/:stockTakingItemId',
      name: 'stockTakingItemEdit',
      props: ({ params: { stockTakingItemId, stockTakingId } }) => ({
        stockTakingItemId,
        stockTakingId,
        from: { name: 'stockTakingProgress' },
      }),
      component: () => import('../components/stock/StockTakingItemEdit.vue'),
    },
  ],
};
