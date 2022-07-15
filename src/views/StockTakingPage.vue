<template lang="pug">

.stock-taking-page

  .header
    el-date-picker.date(v-model="stockTaking.date")
    workflow-button(:workflow="workflow" v-model="stockTaking.processing")

  el-tabs(@tab-click="onTabClick" tab-position="top")
    el-tab-pane(label="Scan")
      resize(:padding="20")
        inventory-page(:value="article" @input="onArticle")
        template(v-if="article")
          stock-taking-item-form(
            v-if="article"
            :model="stockTakingItem"
            :article="article"
          )
          form-buttons(
            :changed="true"
            :deletable="false"
            @saveClick="saveItem"
            @cancelClick="cancelItem"
          )
        el-alert(v-else title="scan barcode")
    el-tab-pane(label="Items")
      resize(:padding="20")
        stock-taking-item-list(:items="stockTakingItems")

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import { workflow } from '@/models/StockTaking';
import WorkflowButton from '@/lib/WorkflowButton.vue';
import InventoryPage from '@/views/InventoryPage.vue';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
// import StockTaking from '@/models/StockTaking';
import StockTakingItem from '@/models/StockTakingItem';
import Article from '@/models/Article';
import FormButtons from '@bit/sistemium.vue.form-buttons/FormButtons.vue';
import find from 'lodash/find';
import * as m from '@/store/inv/mutations';
import StockTakingItemList from '@/components/stock/StockTakingItemList.vue';

const { mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockTakingPage',
  data() {
    return {
      stockTaking: {
        id: 'tst',
        date: new Date(),
        processing: 'progress',
      },
      article: null,
      stockTakingItem: null,
    };
  },
  computed: {
    workflow() {
      return workflow;
    },
    stockTakingItems() {
      return StockTakingItem.reactiveFilter({ stockTakingId: this.stockTaking.id });
    },
  },
  methods: {
    ...mapMutations({
      clearScannedBarcode: m.SET_SCANNED_BARCODE,
    }),
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
      };
    },
    saveItem() {
      this.$saveWithLoading(async () => {
        const { boxRel } = this.stockTakingItem;
        if (boxRel > 1) {
          const { boxes = [] } = this.article;
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
