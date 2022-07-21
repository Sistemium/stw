<template lang="pug">

.articles-page.page
  page-title(title="menu.articles")

  barcode-view(@input="setBarcode")

  .buttons
    tool-button(tool="add" @click="onAdd")

  resize(:padding="20")
    article-list(:articles="articles" @click="onArticleClick" v-if="articles.length")
    el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)

  router-view

</template>
<script>

import ArticleList from '@/components/catalogue/ArticleList.vue';
import Article from '@/models/Article';
import orderBy from 'lodash/orderBy';
import PageTitle from '@/components/PageTitle.vue';
import BarcodeView from '@/components/BarcodeScanner/BarcodeView.vue';

export default {
  name: 'ArticlesPage',
  props: {
    editRoute: String,
    createRoute: String,
  },
  data() {
    return { barcode: null };
  },
  components: { BarcodeView, PageTitle, ArticleList },
  computed: {
    articles() {
      const { barcode } = this;
      const filter = !barcode ? {} : (({ barcodes }) => barcodes && barcodes.includes(barcode));
      return orderBy(Article.reactiveFilter(filter), 'name');
    },
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: this.createRoute,
      });
    },
    setBarcode(barcode) {
      this.barcode = barcode ? barcode.code : null;
    },
    onArticleClick(article) {
      this.$router.push({
        name: this.editRoute,
        params: {
          articleId: article.id,
        },
      });
    },
  },

};

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
