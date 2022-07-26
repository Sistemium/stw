export default {
  path: '/articles',
  name: 'articles',
  component: () => import(/* webpackChunkName: "inventory" */ '../views/ArticlesPage.vue'),
  props: {
    editRoute: 'articleEdit',
    createRoute: 'articleCreate',
    galleryRoute: 'articlePictures',
  },
  meta: {
    useScanner: true,
  },
  children: [
    {
      path: 'pictures/:articleId',
      name: 'articlePictures',
      props: ({ params: { articleId } }) => ({
        articleId,
        from: { name: 'articles' },
      }),
      component: () => import('../views/ArticlePicturesPage.vue'),
    },
    {
      path: 'edit/:articleId',
      name: 'articleEdit',
      props: ({ params: { articleId } }) => ({
        articleId,
        from: { name: 'articles' },
      }),
      component: () => import('../components/catalogue/ArticleEdit.vue'),
    },
    {
      path: 'create',
      name: 'articleCreate',
      props: () => ({
        from: { name: 'articles' },
      }),
      component: () => import('../components/catalogue/ArticleEdit.vue'),
    },
  ],
};
