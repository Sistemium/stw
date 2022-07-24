<template lang="pug">

.articles-page.page
  page-title(title="menu.articles")

  barcode-view(@input="setBarcode")

  .buttons
    search-input(v-model="search" :disabled="!!barcode")
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
import SearchInput from '@/lib/SearchInput.vue';
import { searchArticle } from '@/services/catalogue';

export default {
  name: 'ArticlesPage',
  props: {
    editRoute: String,
    createRoute: String,
  },
  data() {
    return {
      barcode: null,
    };
  },
  components: {
    SearchInput,
    BarcodeView,
    PageTitle,
    ArticleList,
  },
  computed: {
    articles() {
      const { barcode, search } = this;
      const filter = !barcode ? searchArticle(search)
        : (({ barcodes }) => barcodes && barcodes.includes(barcode));
      return orderBy(Article.reactiveFilter(filter), 'name');
    },
    search: {
      get() {
        return this.$route.query.search || '';
      },
      set(search) {
        this.updateRouteParams({}, { search });
      },
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
.buttons {
  display: flex;
  align-items: center;
  .search-input {
    flex: 1;
    margin-right: $margin-right;
  }
}
</style>
