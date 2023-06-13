<template lang="pug">

.stock-date-page
  page-title(title="menu.stockPeriod")
    tool-button(
      tool="refresh"
      @click="refreshClick"
    )
  .filters
    storage-select(
      ref="storageSelectRef"
      v-model="storageId"
    )
    el-date-picker(
      v-model="dateRange"
      type="daterange"
      :unlink-panels="true"
    )
    search-input(v-model="search")
    download-excel-button(
      :data-fn="downloadExcelData"
      :name="downloadExcelName"
    )
  resize(
    :padding="20"
    @resized="setHeight"
  )
    stock-period-table(
      :data="filteredData"
      @row-click="rowClick"
      :height="tableHeight"
    )
  stock-article-details-view(
    v-if="showDetails"
    v-model="showDetails"
    :article-id="articleId"
    :storage-id="storageId"
    :date-b="queryParams.dateB"
    :date-e="queryParams.dateE"
  )

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import PageTitle from '@/components/PageTitle.vue';
import dayjs from 'dayjs';
import map from 'lodash/map';
import pick from 'lodash/pick';
import round from 'lodash/round';
import { useRoute } from 'vue-router';
import { findStockPeriod } from '@/services/warehousing.js';
import StockPeriodTable from '@/components/stock/StockPeriodTable.vue';
import SearchInput from '@/lib/SearchInput.vue';
import { searchArticle } from '@/services/catalogue.js';
import StockArticleDetailsView from '@/components/stock/StockArticleDetailsView.vue';
import { ElLoading } from 'element-plus';
import { useInvStore } from '@/store/invStore';
import StorageSelect from '@/components/stock/StorageSelect.vue';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import Resize from '@/lib/StmResize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import { useRouteParams } from '@/lib/updateRouteParams';
import { t } from '@/lib/validations';
import Article from '@/models/Article.js';
import Storage from '@/models/Storage.js';

// mixins: [storageSelectMixin],

const today = dayjs().endOf('day');
const monthAgo = today.add(-1, 'month');

const dateRange = ref([monthAgo, today]);
const data = ref([]);
const route = useRoute();
const search = ref('');
const articleId = ref<string | null>(route.query.articleId?.toString() || null);
const showDetails = ref(!!articleId.value);
const tableHeight = ref<number>(undefined);
const storageSelectRef = ref(null);
const { updateRouteParams } = useRouteParams();

const store = useInvStore();

const storageId = computed({
  get() {
    return store.currentStorageId;
  },
  set(id) {
    store.currentStorageId = id;
  },
});

const queryParams = computed(() => {
  const [dateB, dateE] = dateRange.value;
  return {
    dateB: dayjs(dateB).startOf('day').toJSON(),
    dateE: dayjs(dateE).endOf('day').toJSON(),
    storageId: storageId.value,
  };
});

const filteredData = computed(() => {
  const searcher = searchArticle(search.value);
  return search.value
    ? data.value.filter(({ article }) => article && searcher(article))
    : data.value;
});

function downloadSchema() {
  return {
    columns: [
      {
        key: 'id',
        title: 'ID',
        width: 0,
      }, {
        key: 'name',
        title: t('concepts.article'),
        width: 55,
      }, {
        key: 'code',
        title: t('fields.code'),
        width: 30,
      }, {
        key: 'initUnits',
        title: t('fields.initUnits'),
        width: 15,
      }, {
        key: 'unitsIn',
        title: t('fields.unitsIn'),
        width: 15,
      }, {
        key: 'unitsOut',
        title: t('fields.unitsOut'),
        width: 15,
      }, {
        key: 'unitsSur',
        title: t('fields.unitsSur'),
        width: 15,
      }, {
        key: 'resultUnits',
        title: t('fields.remains'),
        width: 15,
      }, {
        key: 'resultCost',
        title: t('fields.cost'),
        width: 15,
      },
    ],
  };
}

const downloadExcelName = computed(() => {
  const [dateB, dateE] = dateRange.value;
  const fmt = 'YYYY-MM-DD';
  return [
    t('menu.stockPeriod'),
    Storage.reactiveGet(storageId.value)?.name,
    dayjs(dateB).format(fmt),
    dayjs(dateE).format(fmt),
  ].join('-');
});

function downloadExcelData() {
  const schema = downloadSchema();
  const columns = map(schema.columns, 'key');
  const data = filteredData.value.map(a => ({
    ...pick(a, columns),
    ...pick(Article.getByID(a.articleId), ['name', 'code', 'id']),
    resultCost: round(a.resultCost, 2),
  }));
  return {
    schema,
    data,
  };
}

function setHeight(height) {
  tableHeight.value = height;
}

async function refreshClick() {
  const { storageId, dateB, dateE } = queryParams.value;
  await refresh(storageId, dateB, dateE);
}

async function refresh(storageId, dateB, dateE) {
  const loading = ElLoading.service({});
  try {
    data.value = await findStockPeriod(storageId, dateB, dateE);
  } catch (e) {
    console.error('refresh', e);
  }
  loading.close();
}

function rowClick(row) {
  showDetails.value = true;
  articleId.value = row.articleId;
  updateRouteParams({}, {
    articleId: row.articleId,
  });
}

watch(queryParams, ({ storageId, dateB, dateE }) => {
  if (!storageId || !dateB || !dateE) {
    return;
  }
  refresh(storageId, dateB, dateE)
    .catch(e => console.error(e));
}, { immediate: true });

watch(showDetails, show => {
  if (!show) {
    updateRouteParams({}, {
      articleId: undefined,
    });
  }
});

</script>
<style scoped lang="scss">
@import "../styles/variables";

.filters {
  display: flex;
  justify-content: center;

  :deep(> * + *) {
    margin-left: $margin-right;
  }

  :deep(.el-date-editor) {
    flex-grow: 0;
  }
}

.stm-resize {
  margin-top: $margin-top;
  overflow-y: hidden;
}

.tool-button {
  margin-left: $margin-right;
}

</style>
