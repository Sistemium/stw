<template lang="pug">

drawer-edit.stock-withdrawing-item-edit(
  :title="$tGen('editing', 'stockWithdrawingItem')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :is-drawer="isDrawer"
)
  template(v-slot="{ model }")
    stock-withdrawing-item-form(:model="model" :editable="editable")

</template>
<script>

import drawerEditMixin from '@/lib/drawerEditMixin';
import StockWithdrawingItemForm from '@/components/stock/StockTakingItemForm.vue';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import { stockWithdrawingItemInstance } from '@/services/warehousing';

export default {
  name: 'StockWithdrawingItemEdit',
  mixins: [drawerEditMixin],
  components: { StockWithdrawingItemForm },
  props: {
    stockWithdrawingId: { type: String, required: true },
    stockWithdrawingItemId: String,
    barcode: String,
  },
  computed: {
    stockWithdrawing() {
      return StockWithdrawing.reactiveGet(this.stockWithdrawingId);
    },
    modelOrigin() {
      const { stockWithdrawingItemId: id, stockWithdrawingId, barcode = null } = this;
      return id ? StockWithdrawingItem.reactiveGet(id)
        : stockWithdrawingItemInstance({
          stockWithdrawingId,
          barcode,
          articleId: null,
        });
    },
    editable() {
      const { processing } = this.stockWithdrawing || {};
      return processing === 'progress';
    },
  },
  methods: {
    saveFn(props) {
      return StockWithdrawingItem.createOne(props);
    },
    destroyFn(id) {
      return StockWithdrawingItem.destroy(id);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
