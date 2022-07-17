export default {
  path: '/storages',
  name: 'storages',
  component: () => import(/* webpackChunkName: "catalogue" */ '../views/StoragesPage.vue'),
  props: {
    editRoute: 'storageEdit',
    createRoute: 'storageCreate',
  },
  children: [
    {
      path: 'create',
      name: 'storageCreate',
      props: {
        from: { name: 'storages' },
      },
      component: () => import('../components/stock/StorageEdit.vue'),
    },
    {
      path: 'edit/:storageId',
      name: 'storageEdit',
      props: ({ params: { storageId } }) => ({
        storageId,
        from: { name: 'storages' },
      }),
      component: () => import('../components/stock/StorageEdit.vue'),
    },
  ],
};
