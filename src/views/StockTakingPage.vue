<template lang="pug">

.stock-taking-page

  barcode-scanner(@scan="onScan")

  //.header
    el-date-picker.date(v-model="stockTaking.date" :disabled="true")
    //workflow-button(:workflow="workflow" :value="stockTaking.processing" @input="onProcessing")

  el-tabs(@tab-click="onTabClick" tab-position="top" v-model="currentTab")
    el-tab-pane(:label="$t('settings')" name="settings")
      stock-taking-edit(
        :stockTakingId="stockTakingId"
        :is-drawer="false"
        @closed="onClose"
      )
    el-tab-pane(:label="$t('items')" name="items")
      .buttons(v-if="stockTakingItems.length")
        tool-button(tool="add" @click="onAdd")
      resize(:padding="20")
        stock-taking-item-list(:items="stockTakingItems" @click="onItemClick")
        el-alert.empty(
          v-if="!stockTakingItems.length"
          :title="$t('validation.noData')" :closable="false"
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
import Article from '@/models/Article';
import FormButtons from '@bit/sistemium.vue.form-buttons/FormButtons.vue';
import find from 'lodash/find';
import * as m from '@/store/inv/mutations';
import StockTakingItemList from '@/components/stock/StockTakingItemList.vue';
import { stockTakingItemInstance } from '@/services/warehousing';
import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';
// import StockTakingForm from '@/components/stock/StockTakingForm.vue';
import StockTakingEdit from '@/components/stock/StockTakingEdit.vue';

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
      article: null,
      stockTakingItem: null,
      currentTabData: 'items',
    };
  },
  computed: {
    currentTab: {
      get() {
        const { currentTabData, showScan } = this;
        if (!showScan && currentTabData === 'scan') {
          return 'items';
        }
        return currentTabData;
      },
      set(tab) {
        this.currentTabData = tab;
      },
    },
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
    showScan() {
      return this.stockTaking.processing === 'progress';
    },
  },
  methods: {
    onClose() {
      this.$router.push({ name: this.closeRoute });
    },
    onScan(barcode) {
      this.currentTab = 'items';
      if (barcode) {
        this.onAdd(barcode.code);
      }
    },
    onProcessing(processing) {
      this.$saveWithLoading(async () => {
        await StockTaking.createOne({ ...this.stockTaking, processing });
      });
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
    onTabClick(tab) {
      this.$debug(tab);
    },
    onArticle(article) {
      this.article = article;
      this.stockTakingItem = article && stockTakingItemInstance({
        articleId: article.id,
        stockTakingId: this.stockTakingId,
      });
    },
    saveItem() {
      this.$saveWithLoading(async () => {
        const { boxRel } = this.stockTakingItem;
        if (boxRel > 1) {
          const boxes = this.article.boxes || [];
          if (!find(boxes, { boxRel })) {
            await Article.create({
              ...this.article,
              boxes: [...boxes, { boxRel }],
            });
          }
        }
        await StockTakingItem.create(this.stockTakingItem);
        this.cancelItem();
        this.clearScannedBarcode();
        this.currentTab = 'items';
      });
    },
    cancelItem() {
      this.article = null;
    },
  },
  components: {
    StockTakingEdit,
    // StockTakingForm,
    StockTakingItemList,
    StockTakingItemForm,
    InventoryPage,
    WorkflowButton,
    FormButtons,
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

.stock-taking-page {
  max-width: $max-width;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
}

.date {
  width: 130px;
}

.stm-resize {
  > * + * {
    margin-top: $margin-top;
  }
}

.stock-taking-item-form {
  text-align: right;
}

.buttons {
  margin-bottom: $margin-top;
  text-align: right;
}

.workflow-button {
  float: right;
}

.stock-taking-edit {
  text-align: right;
}

</style>
