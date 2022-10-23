<template lang="pug">

.price-form
  el-form-item(prop="price" :label="$t('fields.price')")
    el-input-number(
      v-model="model.price"
      :disabled="vatPrices"
    )
  el-form-item(prop="vatRate" :label="$t('fields.vatRate')")
    span {{ model.vatRate | percent }}
  el-form-item(prop="vatPrice" :label="$t('fields.vatPrice')")
    el-input-number(
      v-model="model.vatPrice"
      :disabled="!vatPrices"
    )

</template>
<script>

import round from 'lodash/round';

export default {
  name: 'PriceForm',
  props: {
    model: Object,
    vatPrices: Boolean,
  },
  methods: {
    setPrices(price) {
      const { vatPrices, model: { vatRate } } = this;
      const otherField = vatPrices ? 'price' : 'vatPrice';
      const fn = vatPrices ? v => v / (1.0 + vatRate) : v => v * (1.0 + vatRate);
      // eslint-disable-next-line vue/no-mutating-props
      this.model[otherField] = round(fn(price), 2);
    },
  },
  computed: {
    editablePrice() {
      return this.vatPrices ? this.model.vatPrice : this.model.price;
    },
  },
  watch: {
    editablePrice(price) {
      this.setPrices(price);
    },
  },
};

</script>
<style scoped lang="scss">
.el-form-item {
  text-align: right;
}
</style>
