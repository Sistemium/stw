<template lang="pug">

el-main.stock-taking-page.page

  //barcode-scanner(@scan="onScan")

  el-tabs(
    v-model="currentTabData"
    tab-position="top"
  )
    el-tab-pane(:label="$t('concepts.items')" name="items")
      .buttons(v-if="stockTakingItems.length || search")
        workflow-transitions(
          :workflow="workflow"
          :model-value="stockTaking.processing"
          :disabled="isBusy"
          @update:model-value="onProcessing"
        )
        tool-button(
          tool="add"
          @click="onAdd()"
          :disabled="disabled"
        )
      resize(:padding="20")
        stock-taking-item-list(
          :items="stockTakingItems"
          :price-field="vatOperationConfig.priceField"
          @click="onItemClick"
        )
        alert-empty(
          v-if="!stockTakingItems.length"
          :title="$t('validation.noData')"
          @click="onAdd()"
          :button-text="$tAction('add', 'position')"
        )
    el-tab-pane(
      :label="$t('concepts.settings')"
      name="settings"
    )
      stock-taking-edit(
        :stock-taking-id="stockTakingId"
        :is-drawer="false"
        @closed="onClose"
      )

  router-view

</template>
<script setup lang="ts">

import StockTakingItem from '@/models/StockTakingItem.js';
import StockTakingItemList from '@/components/stock/StockTakingItemList.vue';
// import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';
import StockTakingEdit from '@/components/stock/StockTakingEdit.vue';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import { searchByArticle } from '@/services/catalogue.js';
import ToolButton from '@/lib/ToolButton.vue';
import Resize from '@/lib/StmResize.vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import orderBy from 'lodash/orderBy';
import { useRouteParams } from '@/lib/updateRouteParams';
import { useOperationDisabled } from '@/services/workflowing';
import StockTaking, { workflow } from '@/models/StockTaking.js';
import WorkflowTransitions from '@/lib/WorkflowTransitions.vue';
import { useBusy } from '@/views/pages';
import { useVatConfig } from '@/services/vatConfiguring';
// import { useI18n } from 'vue-i18n';
// import StockTaking from '@/models/StockTaking';
// import { useInvStore } from '@/store/invStore';

const props = defineProps({
  createItemRoute: String,
  editItemRoute: String,
  stockTakingId: String,
  closeRoute: String,
});

const { vatOperationConfig } = useVatConfig('stockReceiving');

const currentTabData = ref('items');
const route = useRoute();
const router = useRouter();
const search = computed(() => route.query.search || '');
const stockTaking = computed(() => StockTaking.reactiveGet(props.stockTakingId));
// const stockTakingItem = ref(null);
// const store = useInvStore();
// const stockTaking = computed(() => StockTaking.reactiveGet(props.stockTakingId) || {});

const stockTakingItems = computed(() => {
  const { stockTakingId } = props;
  const items = StockTakingItem.reactiveFilter({ stockTakingId });
  const searched = search.value ? items.filter(searchByArticle(search.value)) : items;
  return orderBy(searched, ['deviceCts', 'cts'], ['desc', 'desc']);
});

const { updateRouteParams } = useRouteParams();
const { disabled } = useOperationDisabled(stockTaking, workflow);
const { setBusy, isBusy } = useBusy();

function onClose(record) {
  if (!record) {
    router.push({ name: props.closeRoute });
  }
}

// function onScan(barcode)  {
//   currentTabData.value = 'items';
//   if (barcode) {
//     onAdd(barcode.code);
//   }
// }

// function clearScannedBarcode() {
//   store.scannedBarcode = '';
// }

function onAdd(barcode) {
  const query = barcode ? { barcode } : {};
  updateRouteParams({
    stockTakingId: props.stockTakingId,
  }, query, props.createItemRoute);
}

function onItemClick(item) {
  updateRouteParams({
    stockTakingItemId: item.id,
    stockTakingId: props.stockTakingId,
  }, {}, props.editItemRoute);
}

function onProcessing(processing) {
  setBusy(StockTaking.updateOne({ id: props.stockTakingId, processing }));
}

// const { t }  = useI18n({
//   messages: {
//     en: {
//       settings: 'Parameters',
//       scan: 'Scan',
//       items: 'Items',
//     },
//     ru: {
//       settings: 'Параметры',
//       scan: 'Сканирование',
//       items: 'Позиции',
//     },
//     lt: {
//       settings: 'Nustatymai',
//       scan: 'Skenavimas',
//       items: 'Pozicijos',
//     },
//   },
// });

</script>
<style scoped lang="scss">
@import "../styles/variables";

.stm-resize {
  > * + * {
    margin-top: $margin-top;
  }
}

.stock-taking-edit {
  text-align: right;
}

.buttons {
  text-align: right;
  margin-bottom: $margin-right;
}

.search-input {
  flex: 1;
}

</style>
