<template lang="pug">

drawer-edit.article-edit(
  :title="$tGen('editing', 'article')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
)
  template(v-slot="{ model }")
    el-tabs
      el-tab-pane(:label="$t('menu.articleProps')")
        article-form(ref="form" :model="model")
      el-tab-pane(:label="$t('menu.barcodes')")
        .list-group
          .list-group-item(
            v-if="!model.barcodes || !model.barcodes.length"
          ) {{ $t('validation.noData') }}
          .list-group-item(v-for="barcode in model.barcodes" :key="barcode")
            .code {{ barcode }}

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
      return articleId ? Article.reactiveGet(articleId) : {
        props: [],
        boxes: [],
        isCustomName: false,
      };
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
      en: {},
      ru: {},
      lt: {},
    },
  },
};

</script>
<style scoped lang="scss">

</style>
