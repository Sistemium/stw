export default function (from) {
  return {
    component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlePicturesPage.vue'),
    name: `${from}Pictures`,
    path: ':articleId/pictures',
    props({ params: { articleId } }) {
      return {
        from: { name: from },
        articleId,
      };
    },
  };
}
