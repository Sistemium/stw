<template lang="pug">

el-main.stock-taking-page.page

  //barcode-scanner(@scan="onScan")

  //.header
    el-date-picker.date(v-model="stockTaking.date" :disabled="true")
    //workflow-button(:workflow="workflow" :value="stockTaking.processing" @input="onProcessing")

  el-tabs(
    v-model="currentTabData"
    tab-position="top"
  )
    el-tab-pane(:label="$t('concepts.items')" name="items")
      .buttons(v-if="stockTakingItems.length || search")
        //search-input(v-model="search")
        tool-button(
          tool="add"
          @click="onAdd()"
        )
      resize(:padding="20")
        stock-taking-item-list(
          :items="stockTakingItems"
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
<script setup>

import StockTakingItem from '@/models/StockTakingItem';
import StockTakingItemList from '@/components/stock/StockTakingItemList.vue';
// import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';
import StockTakingEdit from '@/components/stock/StockTakingEdit.vue';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import { searchByArticle } from '@/services/catalogue';
import ToolButton from '@/lib/ToolButton.vue';
import Resize from '@/lib/Resize.vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import orderBy from 'lodash/orderBy';
import { useRouteParams } from '@/lib/updateRouteParams';
// import { useI18n } from 'vue-i18n';
// import StockTaking from '@/models/StockTaking';
// import { useInvStore } from '@/store/invStore';

const props = defineProps({
  createItemRoute: String,
  editItemRoute: String,
  stockTakingId: String,
  closeRoute: String,
});

const currentTabData = ref('items');
const route = useRoute();
const router = useRouter();
const search = computed(() => route.query.search || '');
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
    stockTakingId: this.stockTakingId,
  }, query, props.createItemRoute);
}

function onItemClick(item) {
  updateRouteParams({
    stockTakingItemId: item.id,
    stockTakingId: props.stockTakingId,
  }, {}, props.editItemRoute);
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
