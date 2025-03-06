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
    el-auto-resizer
      template(#default="{ width }")
        stock-period-table(
          :data="filteredData"
          @row-click="rowClick"
          @avatar-click="avatarClick"
          :height="tableHeight"
          :width="width"
        )
  stock-article-details-view(
    v-if="showDetails"
    v-model="showDetails"
    :article-id="articleId"
    :storage-id="storageId"
    :date-b="queryParams.dateB"
    :date-e="queryParams.dateE"
  )

  router-view

</template>
<script setup lang="ts">

import { computed, onUnmounted, ref, watch } from 'vue'
import PageTitle from '@/components/PageTitle.vue';
import dayjs from 'dayjs';
import map from 'lodash/map';
import pick from 'lodash/pick';
import keyBy from 'lodash/keyBy';
import round from 'lodash/round';
import { useRoute, useRouter } from 'vue-router';
import { findStockPeriod } from '@/services/warehousing.js';
import StockPeriodTable from '@/components/stock/StockPeriodTable.vue';
import SearchInput from '@/lib/SearchInput.vue';
import { catalogueData, searchArticle } from '@/services/catalogue.js';
import StockArticleDetailsView from '@/components/stock/StockArticleDetailsView.vue';
import { ElLoading } from 'element-plus';
import StorageSelect from '@/components/select/StorageSelect.vue';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import Resize from '@/lib/StmResize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import { useRouteParams } from '@/lib/updateRouteParams';
import { t } from '@/lib/validations';
import Storage from '@/models/Storage.js';
import { useStorage } from '@/services/stockoperating';
import type { IStockPeriod } from '@/models/StockPeriod'
import type { IArticle } from '@/models/Articles'
import type { IArticleProp } from '@/models/ArticleProps'
import { subscribeChanges, unsubscribeChanges } from '@/services/socket'
import matchesDeep from 'sistemium-data/lib/util/matchesDeep.js'
import { useDateRange } from '@/services/timing'


const { dateRange } = useDateRange()
const data = ref<(IStockPeriod & { article: IArticle })[]>([]);
const route = useRoute();
const router = useRouter();
const search = ref('');
const articleId = ref<string | null>(route.query.articleId?.toString() || null);
const showDetails = ref(!!articleId.value);
const tableHeight = ref<number>();
const storageSelectRef = ref(null);
const { updateRouteParams } = useRouteParams();

const { storageId } = useStorage();

const props = defineProps<{
  galleryRoute: string;
}>();

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

const subs = [
  'StockArticleDate',
]

subscribeChanges(subs, () => refreshClick(false), false)

onUnmounted(() => {
  unsubscribeChanges(subs)
})

function downloadSchema(tableData: { rows: IArticle[], propColumns: IArticleProp[] }) {
  return {
    wrapText: true,
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
      ...tableData.propColumns
        .map(({ id, name }) => ({ key: id, title: name, width: 25 })),
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
  const tableData = catalogueData();
  const schema = downloadSchema(tableData);
  const columns = map(schema.columns, 'key');
  const { rows } = tableData;
  const articles = keyBy(rows, 'id');
  const data = filteredData.value.map(a => ({
    ...pick({ ...a, ...(articles[a.articleId] || {}) }, columns),
    resultCost: round(a.resultCost, 2),
  }));
  return {
    schema,
    data,
  };
}

function setHeight(height: number) {
  tableHeight.value = height;
}

async function refreshClick(showLoading = true) {
  const { storageId, dateB, dateE } = queryParams.value;
  await refresh(storageId, dateB, dateE, showLoading);
}

async function refresh(storageId: string, dateB: string, dateE: string, showLoading = true) {
  const loading = showLoading ? ElLoading.service({}) : undefined;
  try {
    data.value = await findStockPeriod(storageId, dateB, dateE);
  } catch (e) {
    console.error('refresh', e);
  }
  loading?.close();
}

function rowClick(row: { articleId: string }) {
  showDetails.value = true;
  articleId.value = row.articleId;
  updateRouteParams({}, {
    articleId: row.articleId,
  });
}

function avatarClick({ articleId }: { articleId: string }) {
  router.push({
    name: props.galleryRoute,
    params: {
      articleId,
    },
  });
}

const lastParams = ref<Record<string, any>>({
  storageId: undefined,
  dateB: undefined,
  dateE: undefined,
})

watch(queryParams, ({ storageId, dateB, dateE }) => {
  if (!storageId || !dateB || !dateE) {
    return;
  }
  if (matchesDeep(lastParams.value, queryParams.value)) {
    return
  }
  lastParams.value = queryParams.value
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
@import "../styles/filters";

.stm-resize {
  margin-top: $margin-top;
  overflow-y: hidden;
}

.tool-button {
  margin-left: $margin-right;
}

</style>
