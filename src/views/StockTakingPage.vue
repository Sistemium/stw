<template lang="pug">

.stock-taking-page

  .header
    el-date-picker.date(v-model="stockTaking.date" :disabled="true")
    workflow-button(:workflow="workflow" :value="stockTaking.processing" @input="onProcessing")

  el-tabs(@tab-click="onTabClick" tab-position="top" v-model="currentTab")
    el-tab-pane(:label="$t('scan')" name="scan" v-if="showScan")
      resize(:padding="20")
        inventory-page(:value="article" @input="onArticle" @scan="onScan")
        template(v-if="article")
          stock-taking-item-form(
            v-if="article"
            :editable="true"
            :model="stockTakingItem"
          )
          form-buttons(
            :changed="true"
            :deletable="false"
            @saveClick="saveItem"
            @cancelClick="cancelItem"
          )
    el-tab-pane(:label="$t('items')" name="items")
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

const { mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockTakingPage',
  props: {
    editItemRoute: String,
    stockTakingId: String,
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
    onScan() {
      this.currentTab = 'scan';
    },
    onProcessing(processing) {
      this.$saveWithLoading(async () => {
        await StockTaking.createOne({ ...this.stockTaking, processing });
      });
    },
    ...mapMutations({
      clearScannedBarcode: m.SET_SCANNED_BARCODE,
    }),
    onItemClick(item) {
      this.$router.push({
        name: this.editItemRoute,
        params: {
          stockTakingItemId: item.id,
          stockTakingId: this.stockTaking.id,
        },
      });
    },
    onTabClick(tab) {
      this.$debug(tab);
    },
    onArticle(article) {
      this.article = article;
      this.stockTakingItem = article && {
        articleId: article.id,
        quantity: 1,
        boxRel: 1,
        units: 1,
        stockTakingId: this.stockTaking.id,
        deviceCts: new Date(),
      };
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
      });
    },
    cancelItem() {
      this.article = null;
    },
  },
  components: {
    StockTakingItemList,
    StockTakingItemForm,
    InventoryPage,
    WorkflowButton,
    FormButtons,
  },
  i18n: {
    messages: {
      en: {
        scan: 'Scan',
        items: 'Items',
      },
      ru: {
        scan: 'Сканирование',
        items: 'Позиции',
      },
      lt: {
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

</style>
