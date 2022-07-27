<template lang="pug">

.stock-taking-page.page

  barcode-scanner(@scan="onScan")

  //.header
    el-date-picker.date(v-model="stockTaking.date" :disabled="true")
    //workflow-button(:workflow="workflow" :value="stockTaking.processing" @input="onProcessing")

  el-tabs(tab-position="top" v-model="currentTabData" )
    el-tab-pane(:label="$t('items')" name="items")
      .buttons(v-if="stockTakingItems.length")
        tool-button(tool="add" @click="onAdd")
      resize(:padding="20")
        stock-taking-item-list(:items="stockTakingItems" @click="onItemClick")
        alert-empty(
          v-if="!stockTakingItems.length"
          :title="$t('validation.noData')"
          @click="onAdd()"
          :button-text="$tAction('add', 'position')"
        )
    el-tab-pane(:label="$t('settings')" name="settings")
      stock-taking-edit(
        :stockTakingId="stockTakingId"
        :is-drawer="false"
        @closed="onClose"
      )

  router-view

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import StockTaking, { workflow } from '@/models/StockTaking';
import WorkflowButton from '@/lib/WorkflowButton.vue';
import InventoryPage from '@/views/InventoryPage.vue';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import StockTakingItem from '@/models/StockTakingItem';
import * as m from '@/store/inv/mutations';
import StockTakingItemList from '@/components/stock/StockTakingItemList.vue';
import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';
import StockTakingEdit from '@/components/stock/StockTakingEdit.vue';
import AlertEmpty from '@/lib/AlertEmpty.vue';

const { mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockTakingPage',
  props: {
    createItemRoute: String,
    editItemRoute: String,
    stockTakingId: String,
    closeRoute: String,
  },
  data() {
    return {
      // article: null,
      stockTakingItem: null,
      currentTabData: 'items',
    };
  },
  computed: {
    workflow() {
      return workflow;
    },
    stockTaking() {
      return StockTaking.reactiveGet(this.stockTakingId) || {};
    },
    stockTakingItems() {
      const { stockTakingId } = this;
      const items = StockTakingItem.reactiveFilter({ stockTakingId });
      return this.$orderBy(items, ['deviceCts', 'cts'], ['desc', 'desc']);
    },
  },
  methods: {
    onClose(record) {
      if (!record) {
        this.$router.push({ name: this.closeRoute });
      }
    },
    onScan(barcode) {
      this.currentTab = 'items';
      if (barcode) {
        this.onAdd(barcode.code);
      }
    },
    ...mapMutations({
      clearScannedBarcode: m.SET_SCANNED_BARCODE,
    }),
    onAdd(barcode) {
      const query = barcode ? { barcode } : {};
      this.$router.push({
        name: this.createItemRoute,
        params: {
          stockTakingId: this.stockTakingId,
        },
        query,
      });
    },
    onItemClick(item) {
      this.$router.push({
        name: this.editItemRoute,
        params: {
          stockTakingItemId: item.id,
          stockTakingId: this.stockTakingId,
        },
      });
    },
  },
  components: {
    AlertEmpty,
    StockTakingEdit,
    StockTakingItemList,
    StockTakingItemForm,
    InventoryPage,
    WorkflowButton,
    BarcodeScanner,
  },
  i18n: {
    messages: {
      en: {
        settings: 'Parameters',
        scan: 'Scan',
        items: 'Items',
      },
      ru: {
        settings: 'Параметры',
        scan: 'Сканирование',
        items: 'Позиции',
      },
      lt: {
        settings: 'Nustatymai',
        scan: 'Skenavimas',
        items: 'Pozicijos',
      },
    },
  },
};

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

</style>
