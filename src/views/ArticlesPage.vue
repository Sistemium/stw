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

  resize#articles-page-scroll(
    :class="viewComponentName"
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
<script setup lang="ts">

import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { useI18n } from 'vue-i18n';
import map from 'lodash/map';
import { useRouter } from 'vue-router';
import each from 'lodash/each';
import pick from 'lodash/pick';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import SearchInput from '@/lib/SearchInput.vue';
import Resize from '@/lib/Resize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import useResponsiveTables from '@/components/useResponsiveTables';
import PageTitle from '@/components/PageTitle.vue';
import BarcodeView from '@/components/BarcodeScanner/BarcodeView.vue';
import ArticleList from '@/components/catalogue/ArticleList.vue';
import ArticleTable from '@/components/catalogue/ArticleTable.vue';
import i18n from '@/i18n.js';
import { DocumentCopy } from '@element-plus/icons-vue';
import Article from '@/models/Article.js';
import ArticleProp from '@/models/ArticleProp.js';
import { articlePropertySort, searchArticle } from '@/services/catalogue.js';
import { useScrollToCreated } from '@/services/scrolling';

const props = defineProps<{
  editRoute: string;
  createRoute: string;
  galleryRoute: string;
}>();

const barcode = ref(null);
const search = ref('');
const tableHeight = ref<number>(undefined);
const selectedArticle = ref(null);
const router = useRouter();

useScrollToCreated({});

const copyTip = computed(() => {
  const { code, name } = selectedArticle.value || {};
  return t('copyTip', [code || name]);
});

const { showTable, tableSize } = useResponsiveTables();
const viewComponent = computed<Component>(() => showTable.value ? ArticleTable : ArticleList);
const viewComponentName = computed(() => showTable.value ? 'table' : 'list');

const articles = computed(() => {
  const rowFilter = !barcode.value
    ? searchArticle(search.value, tableData.value.propColumns)
    : ({ barcodes }) => barcodes && barcodes.includes(barcode);
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
    name: props.createRoute,
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

.search-input {
  flex: 1;
}

.stm-resize.table {
  overflow-y: hidden;
}

</style>
