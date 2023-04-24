<template lang="pug">

.articles-page.page
  page-title(title="menu.articles")

  barcode-view(@input="setBarcode")

  .buttons
    search-input(v-model="search" :disabled="!!barcode")
    download-excel-button(
      :data-fn="downloadExcelData"
      :name="$t('menu.articles')"
    )
    el-tooltip(
      v-if="selectedArticle"
      :content="copyTip"
    )
      //transition(name="bounce")
      el-button(
        :icon="DocumentCopy"
        circle
        size="small"
        @click="onCopy()"
      )
    tool-button(
      tool="add"
      @click="onAdd()"
    )

  // ref="resizeRef"
  resize#articles-page-scroll(
    :padding="20"
    @resized="setHeight"
  )
    template(
      v-if="articles.length"
    )
      component(
        :is="viewComponent"
        :prop-columns="tableData.propColumns"
        :size="tableSize"
        :articles="articles"
        :height="tableHeight"
        @current-change="handleCurrentChange"
        @click="onArticleClick"
        @avatar-click="avatarClick"
      )
    el-alert.empty(
      v-else
      type="info"
      :title="$t('validation.noData')"
      :closable="false"
    )

  router-view

</template>
<script setup>

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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import map from 'lodash/map';
import { useRouter } from 'vue-router';
import i18n from '@/i18n';
import useResponsiveTables from '@/components/useResponsiveTables';
import { DocumentCopy } from '@element-plus/icons-vue';

const props = defineProps({
  editRoute: String,
  createRoute: String,
  galleryRoute: String,
});

// const resizeRef = ref(null);
const barcode = ref(null);
const search = ref('');
const tableHeight = ref(undefined);
const selectedArticle = ref(null);
const router = useRouter();

// mixins: [
//   scrollToCreated({ container: '#articles-page-scroll' }),
// ],

const copyTip = computed(() => {
  const { code, name } = selectedArticle.value || {};
  return t('copyTip', [code || name]);
});

const { showTable, tableSize } = useResponsiveTables();
const viewComponent = computed(() => showTable.value ? ArticleTable : ArticleList);

const articles = computed(() => {
  const rowFilter = !barcode.value ? searchArticle(search.value, tableData.value.propColumns)
    : (({ barcodes }) => barcodes && barcodes.includes(barcode));
  return filter(tableData.value.rows, rowFilter);
});

const tableData = computed(() => {
  const allProps = new Map();
  const rows = map(Article.reactiveFilter(), item => {
    const res = {
      ...item,
    };
    each(item.props, ({ propId, stringValue, numberValue }) => {
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
    .filter(x => !!x);
  return {
    rows: orderBy(rows, 'name'),
    propColumns: articlePropertySort(propColumns),
  };
});

const { t } = useI18n({
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
});

function setHeight(height) {
  tableHeight.value = height;
}

function downloadSchema() {
  return {
    columns: [
      {
        key: 'name',
        title: i18n.global.t('fields.name'),
        width: 50,
      }, {
        key: 'code',
        title: i18n.global.t('fields.code'),
        width: 25,
      },
      ...tableData.value.propColumns
        .map(({ id, name }) => ({ key: id, title: name, width: 25 })),
    ],
  };
}

function downloadExcelData() {
  const schema = downloadSchema();
  const columns = map(schema.columns, 'key');
  const data = articles.value.map(a => pick(a, columns));
  return {
    schema,
    data,
  };
}

function onAdd() {
  router.push({
    name: props.createRoute,
  });
}

function onCopy() {
  router.push({
    name: this.createRoute,
    query: { copyId: selectedArticle.value.id },
  });
}

function setBarcode(value) {
  barcode.value = value ? value.code : null;
}

function onArticleClick(article) {
  router.push({
    name: props.editRoute,
    params: {
      articleId: article.id,
    },
  });
}

function handleCurrentChange(row) {
  selectedArticle.value = row;
}

function avatarClick(article) {
  router.push({
    name: props.galleryRoute,
    params: {
      articleId: article.id,
    },
  });
}

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
