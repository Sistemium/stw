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

export default {
  name: 'StockTakingItemEdit',
  components: { StockTakingItemForm, DrawerEdit },
  props: {
    stockTakingId: String,
    stockTakingItemId: String,
    from: Object,
  },
  computed: {
    stockTaking() {
      return StockTaking.reactiveGet(this.stockTakingId || this.modelOrigin.stockTakingId);
    },
    modelOrigin() {
      const { stockTakingItemId: id, stockTakingId } = this;
      return id ? StockTakingItem.reactiveGet(id) : { stockTakingId };
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
