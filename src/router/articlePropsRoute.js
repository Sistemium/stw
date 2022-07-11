export default {
  path: '/articleProps',
  name: 'articleProps',
  component: () => import(/* webpackChunkName: "catalogue" */ '../views/ArticlePropsPage.vue'),
  props: {
    editRoute: 'articlePropEdit',
    createRoute: 'articlePropCreate',
  },
  children: [
    {
      path: 'create',
      name: 'articlePropCreate',
      props: {
        from: { name: 'articleProps' },
      },
      component: () => import('../components/ArticlePropertyEdit.vue'),
    },
    {
      path: 'edit/:articlePropId',
      name: 'articlePropEdit',
      props: ({ params: { articlePropId } }) => ({
        articlePropId,
        from: { name: 'articleProps' },
      }),
      component: () => import('../components/ArticlePropertyEdit.vue'),
    },
  ],
};
