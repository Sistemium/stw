<template lang="pug">

.articles-page.page
  page-title(title="menu.articles")

  barcode-view(@input="setBarcode")

  .buttons
    search-input(v-model="search" :disabled="!!barcode")
    tool-button(tool="add" @click="onAdd()")

  resize#articles-page-scroll(:padding="20" ref="resize")
    template(
      v-if="articles.length"
    )
      component(
        :is="viewComponent"
        :prop-columns="tableData.propColumns"
        :size="tableSize"
        :articles="articles"
        @click="onArticleClick"
        @avatarClick="avatarClick"
      )
    el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)

  router-view

</template>
<script>

import each from 'lodash/each';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import Article from '@/models/Article';
import ArticleProp from '@/models/ArticleProp';
import { searchArticle } from '@/services/catalogue';
import PageTitle from '@/components/PageTitle.vue';
import BarcodeView from '@/components/BarcodeScanner/BarcodeView.vue';
import SearchInput from '@/lib/SearchInput.vue';
import ArticleList from '@/components/catalogue/ArticleList.vue';
import ArticleTable from '@/components/catalogue/ArticleTable.vue';
import scrollToCreated from '@/components/scrollToCreated';
import vssMixin from '@/components/vssMixin';

export default {
  name: 'ArticlesPage',
  props: {
    editRoute: String,
    createRoute: String,
    galleryRoute: String,
  },
  data() {
    return {
      barcode: null,
      search: '',
    };
  },
  mixins: [
    scrollToCreated({ container: '#articles-page-scroll' }),
    vssMixin,
  ],
  components: {
    SearchInput,
    BarcodeView,
    PageTitle,
    ArticleTable,
    ArticleList,
  },
  computed: {
    viewComponent() {
      return this.showTable ? 'article-table' : 'article-list';
    },
    articles() {
      const { barcode, search, tableData } = this;
      const rowFilter = !barcode ? searchArticle(search, tableData.propColumns)
        : (({ barcodes }) => barcodes && barcodes.includes(barcode));
      return filter(tableData.rows, rowFilter);
    },
    tableData() {
      const allProps = new Map();
      const rows = this.$map(Article.reactiveFilter(), item => {
        const { props } = item;
        const res = {
          ...item,
        };
        each(props, ({ propId, stringValue, numberValue }) => {
          allProps.set(propId, true);
          res[propId] = stringValue || numberValue;
        });
        return res;
      });
      return {
        rows: orderBy(rows, 'name'),
        propColumns: Array.from(allProps.keys())
          .map(id => {
            const prop = ArticleProp.reactiveGet(id);
            if (prop.isNaming) {
              return false;
            }
            return {
              ...prop,
              align: prop.type === 'number' ? 'right' : 'left',
            };
          })
          .filter(x => x),
      };
    },
    // search: {
    //   get() {
    //     return this.$route.query.search || '';
    //   },
    //   set(search) {
    //     this.updateRouteParams({}, { search });
    //   },
    // },
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
    avatarClick(article) {
      this.$router.push({
        name: this.galleryRoute,
        params: {
          articleId: article.id,
        },
      });
    },
  },

};

</script>
<style scoped lang="scss">
//@import "../styles/page";

.search-input {
  flex: 1;
}

</style>
