<template lang="pug">

.articles-page.page
  page-title(title="menu.articles")

  barcode-view(@input="setBarcode")

  .buttons
    search-input(v-model="search" :disabled="!!barcode")
    download-excel-button(:data-fn="downloadExcelData" :name="downloadExcelName")
    transition(name="bounce")
      el-tooltip(v-if="selectedArticle")
        template(#content) {{ copyTip }}
        el-button(icon="el-icon-document-copy" @click="onCopy()" circle size="mini")
    tool-button(tool="add" @click="onAdd()")

  resize#articles-page-scroll(:padding="20" ref="resize" @resized="setHeight")
    template(
      v-if="articles.length"
    )
      component(
        :is="viewComponent"
        :prop-columns="tableData.propColumns"
        :size="tableSize"
        :articles="articles"
        @current-change="handleCurrentChange"
        @click="onArticleClick"
        @avatar-click="avatarClick"
        :height="tableHeight"
      )
    el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)

  router-view

</template>
<script>

import each from 'lodash/each';
import pick from 'lodash/pick';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import Article from '@/models/Article';
import ArticleProp from '@/models/ArticleProp';
import { articlePropertySort, searchArticle } from '@/services/catalogue';
import PageTitle from '@/components/PageTitle.vue';
import BarcodeView from '@/components/BarcodeScanner/BarcodeView.vue';
import SearchInput from '@/lib/SearchInput.vue';
import ArticleList from '@/components/catalogue/ArticleList.vue';
import ArticleTable from '@/components/catalogue/ArticleTable.vue';
import scrollToCreated from '@/components/scrollToCreated';
import vssMixin from '@/components/vssMixin';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import Resize from '@/lib/Resize.vue';
import ToolButton from '@/lib/ToolButton.vue';

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
      tableHeight: undefined,
      selectedArticle: null,
    };
  },
  mixins: [
    scrollToCreated({ container: '#articles-page-scroll' }),
    vssMixin,
  ],
  components: {
    ToolButton,
    Resize,
    DownloadExcelButton,
    SearchInput,
    BarcodeView,
    PageTitle,
    ArticleTable,
    ArticleList,
  },
  computed: {
    downloadExcelName() {
      return this.$t('menu.articles');
    },
    copyTip() {
      const { code, name } = this.selectedArticle || {};
      return this.$t('copyTip', [code || name]);
    },
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
      const propColumns = Array.from(allProps.keys())
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
        .filter(x => x);
      return {
        rows: orderBy(rows, 'name'),
        propColumns: articlePropertySort(propColumns),
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
  i18n: {
    messages: {
      en: {
        copyTip: 'Click to copy "{0}" article',
      },
      lt: {
        copyTip: 'Spustelkite kad nukopijuoti "{0}" prekę',
      },
      ru: {
        copyTip: 'Нажмите, чтобы скопировать номенклатуру "{0}"',
      },
    },
  },
  methods: {
    setHeight(height) {
      this.tableHeight = height;
    },
    downloadSchema() {
      return {
        columns: [
          {
            key: 'name',
            title: this.$t('fields.name'),
            width: 50,
          }, {
            key: 'code',
            title: this.$t('fields.code'),
            width: 25,
          },
          ...this.tableData.propColumns
            .map(({ id, name }) => ({ key: id, title: name, width: 25 })),
        ],
      };
    },
    downloadExcelData() {
      const schema = this.downloadSchema();
      const columns = this.$map(schema.columns, 'key');
      const data = this.articles.map(a => pick(a, columns));
      return {
        schema,
        data,
      };
    },
    onAdd() {
      this.$router.push({
        name: this.createRoute,
      });
    },
    onCopy() {
      this.$router.push({
        name: this.createRoute,
        query: { copyId: this.selectedArticle.id },
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
    handleCurrentChange(row) {
      this.selectedArticle = row;
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

.stm-resize {
  overflow-y: hidden;
}

</style>
