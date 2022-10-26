export default {
  component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlePicturesPage.vue'),
  name: 'articlePictures',
  path: ':articleId/pictures',
  props({ params: { articleId } }) {
    return {
      from: { name: 'articles' },
      articleId,
    };
  },
};
