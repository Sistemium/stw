<template lang="pug">

drawer-edit.stock-taking-edit(
  :title="$tGen('editing', 'stockTaking')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
)
  template(v-slot="{ model }")
    stock-taking-form(ref="form" :model="model")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockTaking from '@/models/StockTaking';
import StockTakingForm from '@/components/stock/StockTakingForm.vue';

export default {
  name: 'StockTakingEdit',
  props: {
    stockTakingId: String,
    from: Object,
  },
  computed: {
    modelOrigin() {
      const { stockTakingId } = this;
      return stockTakingId ? StockTaking.reactiveGet(stockTakingId) : {
        date: new Date(),
        processing: 'processing',
      };
    },
  },
  methods: {
    saveFn(props) {
      return StockTaking.createOne(props);
    },
    destroyFn(id) {
      return StockTaking.destroy(id);
    },
  },
  components: { StockTakingForm, DrawerEdit },
};

</script>
<style scoped lang="scss">

</style>
