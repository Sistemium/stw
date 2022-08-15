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
    stock-taking-item-form(:model="model" :editable="editable")
      template(v-slot:article-extra)
        el-form-item(prop="price" :label="$t('fields.price')")
          el-input-number(v-model="model.price")

</template>
<script>

import drawerEditMixin from '@/lib/drawerEditMixin';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import { workflow } from '@/models/StockWithdrawing';
import { stockOperationItemInstance, vatConfig } from '@/services/warehousing';

export default {
  name: 'StockOperationItemEdit',
  mixins: [drawerEditMixin],
  components: { StockTakingItemForm },
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
    stockOperation() {
      return this.model.reactiveGet(this.stockOperationId);
    },
    modelOrigin() {
      const { stockOperationItemId: id, stockOperationId, barcode = null } = this;
      return id ? this.positionsModel.reactiveGet(id)
        : stockOperationItemInstance(this.operationName, {
          stockOperationId,
          barcode,
          articleId: null,
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

.el-form-item {
  text-align: right;
}

</style>
