<template lang="pug">

drawer-edit.article-edit(
  :title="$t('title')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
)
  template(v-slot="{ model }")
    article-form(ref="form" :model="model")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import Article from '@/models/Article';
import ArticleForm from '@/components/catalogue/ArticleForm.vue';

export default {
  name: 'ArticleEdit',
  props: {
    articleId: String,
    from: Object,
  },
  components: {
    ArticleForm,
    DrawerEdit,
  },
  computed: {
    modelOrigin() {
      const { articleId } = this;
      return articleId ? Article.reactiveGet(articleId) : { props: [] };
    },
  },
  methods: {
    destroyFn() {
      const { articleId } = this;
      return articleId && this.$saveWithLoading(() => Article.destroy(articleId));
    },
    saveFn(props) {
      return this.$saveWithLoading(() => Article.createOne(props));
    },
  },
  i18n: {
    messages: {
      en: {
        title: 'Article edit',
      },
      ru: {
        title: 'Редактирование номенклатуры',
      },
      lt: {
        title: 'Nomenklatūros redagavimas',
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
