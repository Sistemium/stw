<template lang="pug">

el-main.stock-taking-page.page

  barcode-scanner(@scan="onScan")

  //.header
    el-date-picker.date(v-model="stockTaking.date" :disabled="true")
    //workflow-button(:workflow="workflow" :value="stockTaking.processing" @input="onProcessing")

  el-tabs(tab-position="top" v-model="currentTabData" )
    el-tab-pane(:label="$t('concepts.items')" name="items")
      .buttons(v-if="stockTakingItems.length || search")
        //search-input(v-model="search")
        tool-button(tool="add" @click="onAdd()")
      resize(:padding="20")
        stock-taking-item-list(:items="stockTakingItems" @click="onItemClick")
        alert-empty(
          v-if="!stockTakingItems.length"
          :title="$t('validation.noData')"
          @click="onAdd()"
          :button-text="$tAction('add', 'position')"
        )
    el-tab-pane(:label="$t('concepts.settings')" name="settings")
      stock-taking-edit(
        :stock-taking-id="stockTakingId"
        :is-drawer="false"
        @closed="onClose"
      )

  router-view

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import StockTaking, { workflow } from '@/models/StockTaking';
import StockTakingItem from '@/models/StockTakingItem';
import * as m from '@/store/inv/mutations';
import StockTakingItemList from '@/components/stock/StockTakingItemList.vue';
import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';
import StockTakingEdit from '@/components/stock/StockTakingEdit.vue';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import { searchByArticle } from '@/services/catalogue';
import ToolButton from '@/lib/ToolButton.vue';
import Resize from '@/lib/Resize.vue';

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
      // search: '',
      stockTakingItem: null,
      currentTabData: 'items',
    };
  },
  computed: {
    search() {
      return this.$route.query.search || '';
    },
    workflow() {
      return workflow;
    },
    stockTaking() {
      return StockTaking.reactiveGet(this.stockTakingId) || {};
    },
    stockTakingItems() {
      const { stockTakingId, search } = this;
      const items = StockTakingItem.reactiveFilter({ stockTakingId });
      const searched = search ? items.filter(searchByArticle(search)) : items;
      return this.$orderBy(searched, ['deviceCts', 'cts'], ['desc', 'desc']);
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
      this.updateRouteParams({
        stockTakingId: this.stockTakingId,
      }, query, this.createItemRoute);
    },
    onItemClick(item) {
      this.updateRouteParams({
        stockTakingItemId: item.id,
        stockTakingId: this.stockTakingId,
      }, {}, this.editItemRoute);
    },
  },
  components: {
    Resize,
    ToolButton,
    AlertEmpty,
    StockTakingEdit,
    StockTakingItemList,
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

.search-input {
  flex: 1;
}

</style>
