<template lang="pug">

.stock-withdrawing

  el-tabs(tab-position="top")

    el-tab-pane(:lazy="true" :label="$t('concepts.items')")
      .buttons
        workflow-transitions(
          :workflow="workflow"
          :value="stockOperation.processing"
          @input="onProcessing"
          :disabled="busy"
        )
        tool-button(tool="add" @click="onAddItem" :disabled="disabled")
      resize(:padding="20")
        stock-operation-item-list(
          :items="stockOperationItems"
          @click="onItemClick"
          v-if="stockOperationItems.length"
          :price-field="priceField"
        )
        alert-empty(v-else @click="onAddItem" :button-text="$tAction('add', 'position')")

    el-tab-pane(:lazy="true" :label="$t('concepts.production')" v-if="productionItems")
      .buttons
        workflow-transitions(
          :workflow="workflow"
          :value="stockOperation.processing"
          @input="onProcessing"
          :disabled="busy"
        )
        tool-button(tool="add" @click="onAddProduct" :disabled="disabled")
      resize(:padding="20")
        production-item-list(
          :items="productionItems"
          v-if="productionItems.length"
          @click="onProductClick"
        )
        alert-empty(v-else @click="onAddProduct" :button-text="$tAction('add', 'productItem')")

    el-tab-pane(:lazy="true" :label="$t('concepts.settings')")
      stock-operation-edit(
        :is-drawer="false"
        :stock-operation-id="stockOperationId"
        @closed="onEditClose"
        :counterparty-role="counterpartyRole"
        :model="model"
        :operation-name="operationName"
      )
  router-view

</template>
<script>
import { workflow } from '@/models/StockWithdrawing';
import WorkflowTransitions from '@/lib/WorkflowTransitions.vue';
import pageMixin from '@/lib/pageMixin';
import StockOperationItemList from '@/components/out/StockOperationItemList.vue';
import StockOperationEdit from '@/components/out/StockOperationEdit.vue';
import ProductionItemList from '@/components/production/ProductionItemList.vue';
import StockWithdrawingProduct from '@/models/StockWithdrawingProduct';
import { configPriceField } from '@/services/warehousing';

export default {
  name: 'StockOperationPage',
  components: {
    ProductionItemList,
    WorkflowTransitions,
    StockOperationEdit,
    StockOperationItemList,
  },
  mixins: [pageMixin],
  props: {
    stockOperationId: String,
    from: Object,
    model: Object,
    positionsModel: Object,
    counterpartyRole: String,
    operationName: String,
  },
  computed: {
    workflow() {
      return workflow;
    },
    priceField() {
      return configPriceField(this.operationName, this.stockOperation.date);
    },
    productionItems() {
      if (this.operationName !== 'stockWithdrawing') {
        return null;
      }
      const { stockOperationId: stockWithdrawingId } = this;
      return StockWithdrawingProduct.reactiveFilter({ stockWithdrawingId });
    },
    stockOperationItems() {
      const { stockOperationId } = this;
      return this.positionsModel.reactiveFilter({
        [`${this.operationName}Id`]: stockOperationId,
      });
    },
    stockOperation() {
      return this.model.reactiveGet(this.stockOperationId) || {};
    },
    disabled() {
      const { processing } = this.stockOperation;
      return !workflow.step(processing).editable;
    },
  },
  methods: {
    onAddItem() {
      this.$router.push({
        name: this.createRoute,
        params: {
          stockOperationId: this.stockOperationId,
        },
      });
    },
    onAddProduct() {
      this.$router.push({
        name: 'stockWithdrawingProductCreate',
        params: {
          stockWithdrawingId: this.stockOperationId,
        },
      });
    },
    onProductClick(item) {
      this.$router.push({
        name: 'stockWithdrawingProductEdit',
        params: {
          stockOperationId: this.stockOperationId,
          stockOperationItemId: item.id,
        },
      });
    },
    onItemClick(item) {
      this.$router.push({
        name: this.editRoute,
        params: {
          stockOperationId: this.stockOperationId,
          stockOperationItemId: item.id,
        },
      });
    },
    onEditClose(record) {
      if (!record) {
        this.$router.replace({ name: this.from.name });
      }
    },
    onProcessing(processing) {
      this.setBusy(this.model.patch(this.stockOperationId, { processing }));
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

.stock-withdrawing {
  flex: 1;
}

.stock-operation-edit {
  text-align: left;
  @include responsive-only(xxs) {
    text-align: right;
  }
}
</style>
