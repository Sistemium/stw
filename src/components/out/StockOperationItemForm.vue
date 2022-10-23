<template lang="pug">

stock-taking-item-form.stock-operation-item-form(
  :model="model"
  :editable="editable"
  ref="itemForm"
)
  template(v-slot:article-extra)
    price-form(:model="model" :vat-prices="vatPrices")

</template>
<script>

import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import PriceForm from '@/components/out/PriceForm.vue';

export default {
  name: 'StockOperationItemForm',
  components: { PriceForm, StockTakingItemForm },
  props: {
    editable: Boolean,
    model: Object,
    vatPrices: Boolean,
  },
  methods: {
    validate(cb) {
      const { itemForm } = this.$refs;
      const { form } = itemForm.$refs;
      // this.$debug('validate:', form, itemForm);
      if (!form) {
        cb(false);
        return;
      }
      form.validate(cb);
    },

  },

};

</script>
<style scoped lang="scss">

</style>
