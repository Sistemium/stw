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
      closeRoute: 'stockTakings',
    };
  },
  children: [
    {
      path: 'create',
      name: 'stockTakingItemCreate',
      props: ({ params: { stockTakingId }, query: { barcode } }) => ({
        stockTakingId,
        barcode,
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
