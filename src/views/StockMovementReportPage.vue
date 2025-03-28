<template lang="pug">

.stock-movement-report-page
  page-title(title="reports.stockMovement")
  .filters
    .storages
      label {{ $t('fields.from') }}
      storage-select(
        v-model="storageId"
        clearable
      )
      label {{ $t('fields.to') }}
      storage-select(
        v-model="counterPartyId"
        clearable
      )
    el-date-picker(
      v-model="dateRange"
      type="daterange"
      :unlink-panels="true"
    )
    //search-input(v-model="search")
    download-excel-button(
      :data-fn="downloadExcelData"
      :name="downloadExcelName"
    )
  resize(
    :padding="20"
    @resized="height => { tableHeight = height }"
  )
    stock-items-table(
      :data="data"
      :height="tableHeight"
    )

</template>

<script setup lang="ts">

import map from 'lodash/map';
import pick from 'lodash/pick';
import dayjs from 'dayjs';
import { useRouteParams } from '@/lib/updateRouteParams';
import { computed, ref, watch } from 'vue';
import PageTitle from '@/components/PageTitle.vue';
import StorageSelect from '@/components/select/StorageSelect.vue';
// import SearchInput from '@/lib/SearchInput.vue';
import Resize from '@/lib/StmResize.vue';
import { type StockOperationReportItem, useStorage, withdrawingReportData } from '@/services/stockoperating'
import StockItemsTable from '@/components/stock/StockItemsTable.vue';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import { t } from '@/lib/validations';
import Storage from '@/models/Storage.js';
import Article from '@/models/Article.js';

const today = dayjs().endOf('day');
const monthAgo = today.add(-3, 'month');
// const dateRange = ref([monthAgo, today]);
const { storageId } = useStorage();
const data = ref<StockOperationReportItem[]>([]);
const { route, updateRouteParams } = useRouteParams();
const counterPartyId = computed<string | undefined>({
  get() {
    return route.query.counterPartyId as string || undefined;
  },
  set(id) {
    updateRouteParams({}, { counterPartyId: id });
  },
});
const tableHeight = ref<number>();

const queryParams = computed(() => {
  const [dateB, dateE] = dateRange.value;
  return {
    dateB: dayjs(dateB).startOf('day').toJSON(),
    dateE: dayjs(dateE).endOf('day').toJSON(),
    storageId: storageId.value,
    counterPartyId: counterPartyId.value,
  };
});

const dateRange = computed({
  get() {
    const { dateB, dateE } = route.query
    return [
      dayjs(dateB as string || monthAgo).toDate(),
      dayjs(dateE as string || today).toDate(),
    ];
  },
  set([dateB, dateE]) {
    updateRouteParams({}, {
      dateB: dayjs(dateB).toJSON(),
      dateE: dayjs(dateE).toJSON(),
    })
  }
})

watch(queryParams, p => {
  if (!(p.storageId || p.counterPartyId) || !p.dateB || !p.dateE) {
    data.value = []
    return;
  }
  withdrawingReportData(p.storageId, p.counterPartyId, p.dateB, p.dateE)
    .then(res => {
      data.value = res;
    })
    .catch(e => console.error(e));
}, { immediate: true });

function downloadSchema() {
  return {
    wrapText: true,
    columns: [
      {
        key: 'date',
        title: t('fields.date'),
        width: 15,
        // dataType: 'date',
        // numFmt: 'yyyy-mm-dd',
      }, {
        key: 'name',
        title: t('concepts.article'),
        width: 55,
      }, {
        key: 'code',
        title: t('fields.code'),
        width: 20,
      }, {
        key: 'units',
        title: t('fields.units'),
        width: 15,
      },
    ],
  };
}

const downloadExcelName = computed(() => {
  const [dateB, dateE] = dateRange.value;
  const fmt = 'YYYY-MM-DD';
  return [
    t('reports.stockMovement'),
    storageId.value && t('fields.from'),
    Storage.reactiveGet(storageId.value)?.name,
    counterPartyId.value && t('fields.to'),
    Storage.reactiveGet(counterPartyId.value)?.name,
    dayjs(dateB).format(fmt),
    dayjs(dateE).format(fmt),
  ]
    .filter(x => x)
    .join('-');
});

function downloadExcelData() {
  const schema = downloadSchema();
  const columns = map(schema.columns, 'key');
  return {
    schema,
    data: data.value.map(item => ({
      ...pick({
        ...item,
        ...(Article.getByID(item.articleId) || {}),
        date: dayjs(item.date).format('YYYY-MM-DD'),
      }, columns),
    })),
  };
}

</script>

<style scoped lang="scss">
@import "@/styles/filters.scss";

.filters {
  label {
    margin: 0 $padding;
  }
}
</style>
