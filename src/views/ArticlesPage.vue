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
        ref="viewComponentRef"
        :is="viewComponent"
        :prop-columns="tableData.propColumns"
        :size="tableSize"
        :articles="articles"
        :height="tableHeight"
        @current-change="handleCurrentChange"
        @click="onArticleClick"
        @avatar-click="avatarClick"
        :selected-id="selectedArticle?.id"
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
import pick from 'lodash/pick';
import filter from 'lodash/filter';
import SearchInput from '@/lib/SearchInput.vue';
import Resize from '@/lib/StmResize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import useResponsiveTables from '@/components/useResponsiveTables';
import PageTitle from '@/components/PageTitle.vue';
import BarcodeView from '@/components/BarcodeScanner/BarcodeView.vue';
import ArticleList from '@/components/catalogue/ArticleList.vue';
import ArticleTable from '@/components/catalogue/ArticleTable.vue';
import { t } from '@/lib/validations';
import { DocumentCopy } from '@element-plus/icons-vue';
import { catalogueData, searchArticle } from '@/services/catalogue.js';
import { useScrollToCreated } from '@/services/scrolling';
import { useRouteParams } from '@/lib/updateRouteParams'

const props = defineProps<{
  editRoute: string;
  createRoute: string;
  galleryRoute: string;
}>();

const barcode = ref<string>('');
const tableHeight = ref<number>();
const selectedArticle = ref();
const { route, router, updateRouteParams } = useRouteParams()
const viewComponentRef = ref();
const search = computed({
  get() {
    return route.query.search;
  },
  set(search) {
    updateRouteParams({}, { search: search || undefined });
  },
});

useScrollToCreated({
  ifIdExistsFn(id: string): boolean {
    return viewComponentRef.value?.isReady()
      && !!articles.value.find(a => a.id === id);
  },
  scrollToIdFn(id: string) {
    return viewComponentRef.value?.scrollToId(id);
  },
});

const copyTip = computed(() => {
  const { code, name } = selectedArticle.value || {};
  return localT('copyTip', [code || name]);
});

const { showTable, tableSize } = useResponsiveTables();
const viewComponent = computed<Component>(() => showTable.value ? ArticleTable : ArticleList);
const viewComponentName = computed(() => showTable.value ? 'table' : 'list');

const articles = computed(() => {
  const rowFilter = !barcode.value
    ? searchArticle(search.value as string)
    : ({ barcodes }: { barcodes: string[] }) => barcodes && barcodes.includes(barcode.value);
  return filter(tableData.value.rows, rowFilter);
});

const tableData = computed(catalogueData);

const { t: localT } = useI18n({
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

function setHeight(height: number) {
  tableHeight.value = height;
}

function downloadSchema() {
  return {
    wrapText: true,
    columns: [
      {
        key: 'name',
        title: t('fields.name'),
        width: 50,
      }, {
        key: 'code',
        title: t('fields.code'),
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

function setBarcode(value: { code: string }) {
  barcode.value = value ? value.code : '';
}

function onArticleClick(article: { id: string }) {
  router.push({
    name: props.editRoute,
    params: {
      articleId: article.id,
    },
    query: route.query,
  });
}

function handleCurrentChange(row: object) {
  selectedArticle.value = row;
}

function avatarClick(article: { id: string }) {
  router.push({
    name: props.galleryRoute,
    params: {
      articleId: article.id,
    },
    query: route.query,
  });
}

</script>
<style scoped lang="scss">

.search-input {
  flex: 1;
}

.stm-resize {
  overflow-y: hidden;
}

</style>
