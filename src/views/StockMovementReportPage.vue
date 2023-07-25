<template lang="pug">

.stock-movement-report-page
  page-title(title="reports.stockMovement")
  .filters
    .storages
      label {{ $t('fields.from') }}
      storage-select(
        v-model="storageId"
      )
      label {{ $t('fields.to') }}
      storage-select(
        v-model="counterPartyId"
      )
    el-date-picker(
      v-model="dateRange"
      type="daterange"
      :unlink-panels="true"
    )
    //search-input(v-model="search")
    //download-excel-button(
    //  :data-fn="downloadExcelData"
    //  :name="downloadExcelName"
    //)
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

import dayjs from 'dayjs';
import { useRouteParams } from '@/lib/updateRouteParams';
import { computed, ref, watch } from 'vue';
import PageTitle from '@/components/PageTitle.vue';
import StorageSelect from '@/components/stock/StorageSelect.vue';
// import SearchInput from '@/lib/SearchInput.vue';
import Resize from '@/lib/StmResize.vue';
import { useStorage, withdrawingReportData } from '@/services/stockoperating';
import StockItemsTable from '@/components/stock/StockItemsTable.vue';
// import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';

const today = dayjs().endOf('day');
const monthAgo = today.add(-3, 'month');
const dateRange = ref([monthAgo, today]);
const { storageId } = useStorage();
const data = ref([]);
const { route, updateRouteParams } = useRouteParams();
const counterPartyId = computed<string>({
  get() {
    return route.query.counterPartyId as string || null;
  },
  set(id) {
    updateRouteParams({}, { counterPartyId: id });
  },
});
const tableHeight = ref<number>(undefined);

const queryParams = computed(() => {
  const [dateB, dateE] = dateRange.value;
  return {
    dateB: dayjs(dateB).startOf('day').toJSON(),
    dateE: dayjs(dateE).endOf('day').toJSON(),
    storageId: storageId.value,
    counterPartyId: counterPartyId.value,
  };
});

watch(queryParams, p => {
  if (!p.storageId || !p.dateB || !p.dateE || !p.counterPartyId) {
    return;
  }
  withdrawingReportData(p.storageId, p.counterPartyId, p.dateB, p.dateE)
    .then(res => {
      data.value = res;
    })
    .catch(e => console.error(e));
}, { immediate: true });

</script>

<style scoped lang="scss">
@import "@/styles/filters.scss";
.filters {
  label {
    margin: 0 $padding;
  }
}
</style>
