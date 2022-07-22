<template lang="pug">

drawer-edit.stock-taking-item-edit(
  :title="$tGen('editing', 'stockTakingItem')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="editable"
)
  template(v-slot="{ model }")
    stock-taking-item-form(ref="form" :model="model" :editable="editable")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockTakingItem from '@/models/StockTakingItem';
import StockTaking from '@/models/StockTaking';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import { stockTakingItemInstance } from '@/services/warehousing';

export default {
  name: 'StockTakingItemEdit',
  components: { StockTakingItemForm, DrawerEdit },
  props: {
    stockTakingId: { type: String, required: true },
    stockTakingItemId: String,
    from: Object,
    barcode: String,
  },
  computed: {
    stockTaking() {
      return StockTaking.reactiveGet(this.stockTakingId);
    },
    modelOrigin() {
      const { stockTakingItemId: id, stockTakingId, barcode } = this;
      return id ? StockTakingItem.reactiveGet(id)
        : stockTakingItemInstance({
          stockTakingId,
          barcode,
        });
    },
    editable() {
      const { processing } = this.stockTaking || {};
      return processing === 'progress';
    },
  },
  methods: {
    saveFn(props) {
      return StockTakingItem.createOne(props);
    },
    destroyFn(id) {
      return StockTakingItem.destroy(id);
    },
  },

};

</script>
<style scoped lang="scss">

</style>
