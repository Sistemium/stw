export default {
  path: '/articles',
  name: 'articles',
  component: () => import(/* webpackChunkName: "inventory" */ '../views/ArticlesPage.vue'),
  props: {
    editRoute: 'articleEdit',
    createRoute: 'articleCreate',
  },
  meta: {
    useScanner: true,
  },
  children: [
    {
      path: 'edit/:articleId',
      name: 'articleEdit',
      props: ({ params: { articleId } }) => ({
        articleId,
        from: { name: 'articles' },
      }),
      component: () => import('../components/catalogue/ArticleEdit.vue'),
    },
  ],
};
