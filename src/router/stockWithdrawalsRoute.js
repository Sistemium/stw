import { itemRouteHelper } from '@/router/helpers';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';

export default {
  path: '/stockWithdrawals',
  name: 'stockWithdrawals',
  component: () => import(/* webpackChunkName: "stock" */ '../views/StockWithdrawalsPage.vue'),
  props: {
    rootState: 'stockWithdrawals',
    editRoute: 'stockWithdrawing',
    createRoute: 'stockWithdrawingCreate',
  },
  async beforeEnter(to, from, next) {
    const data = await StockWithdrawing.findAll({});
    const ids = data.map(({ id }) => id);
    await StockWithdrawingItem.findByMany(ids, { field: 'stockWithdrawingId' });
    next();
  },
  children: [
    {
      path: 'create',
      name: 'stockWithdrawingCreate',
      props: ({ params }) => ({
        from: params.from || { name: 'stockWithdrawals' },
        editRoute: 'stockWithdrawing',
      }),
      component: () => import('../components/out/StockWithdrawingEdit.vue'),
    },
    {
      path: 'edit/:stockWithdrawingId',
      name: 'stockWithdrawing',
      props: ({ params: { stockWithdrawingId } }) => ({
        stockWithdrawingId,
        from: { name: 'stockWithdrawals' },
        editRoute: 'stockWithdrawingItemEdit',
        createRoute: 'stockWithdrawingItemCreate',
      }),
      component: () => import('../views/StockWithdrawingPage.vue'),
      children: itemRouteHelper('stockWithdrawing', () => import('../components/out/StockWithdrawingItemEdit.vue')),
    },
  ],
};
