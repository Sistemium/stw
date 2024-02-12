import type { BaseItem } from '@/init/Model'

export default function (from: string) {
  return {
    component: () => import(/* webpackChunkName: "articles" */ '../views/ArticlePicturesPage.vue'),
    name: `${from}Pictures`,
    path: ':articleId/pictures',
    props({ params: { articleId } }: BaseItem) {
      return {
        from: { name: from },
        articleId,
        authoring: true,
      };
    },
  };
}
