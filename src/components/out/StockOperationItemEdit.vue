<template lang="pug">

drawer-edit.stock-operation-item-edit(
  :title="$tGen('editing', `${operationName}Item`)"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :is-drawer="isDrawer"
)
  template(v-slot="{ model }")
    stock-operation-item-form(
      ref="form"
      :editable="editable"
      :model="model"
      :vat-prices="vatOperationConfig.vatPrices"
      :vat-rate="vatOperationConfig.vatRate"
    )

</template>
<script>

import drawerEditMixin from '@/lib/drawerEditMixin';
import { workflow } from '@/models/StockWithdrawing';
import { stockOperationItemInstance, vatConfig } from '@/services/warehousing';
import StockOperationItemForm from '@/components/out/StockOperationItemForm.vue';

export default {
  name: 'StockOperationItemEdit',
  mixins: [drawerEditMixin],
  components: { StockOperationItemForm },
  props: {
    stockOperationId: { type: String, required: true },
    stockOperationItemId: String,
    barcode: String,
    operationName: { type: String, required: true },
    model: Object,
    positionsModel: Object,
  },
  computed: {
    vatConfig() {
      return vatConfig();
    },
    vatOperationConfig() {
      const { vatConfig: { rules }, operationName } = this;
      const { vatPrices = {}, defaultRate: vatRate = 0 } = rules;
      return {
        vatRate,
        vatPrices: vatPrices[operationName] || false,
      };
    },
    stockOperation() {
      return this.model.reactiveGet(this.stockOperationId);
    },
    modelOrigin() {
      const { stockOperationItemId: id, stockOperationId, barcode = null } = this;
      const { vatRate } = this.vatOperationConfig;
      return id ? this.positionsModel.reactiveGet(id)
        : stockOperationItemInstance(this.operationName, {
          stockOperationId,
          barcode,
          articleId: null,
          vatRate,
        });
    },
    editable() {
      const { processing } = this.stockOperation || {};
      return workflow.step(processing).editable;
    },
  },
  methods: {
    saveFn(props) {
      return this.positionsModel.createOne(props);
    },
    destroyFn(id) {
      return this.positionsModel.destroy(id);
    },
  },
};

</script>
<style scoped lang="scss">
</style>
