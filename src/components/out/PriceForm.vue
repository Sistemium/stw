<template lang="pug">
// eslint-disable vue/no-mutating-props
.price-form
  el-form-item(prop="price" :label="$t('fields.price')")
    el-input-number(
      v-model="model.price"
      :disabled="vatPrices"
    )
  el-form-item(prop="vatRate" :label="$t('fields.vatRate')")
    span {{ $percent(model.vatRate) }}
  el-form-item(prop="vatPrice" :label="$t('fields.vatPrice')")
    el-input-number(
      v-model="model.vatPrice"
      :disabled="!vatPrices"
    )

</template>
<script setup lang="ts">

import round from 'lodash/round';
import { computed, watch } from 'vue';
import { $percent } from '@/lib/validations';

const props = defineProps<{
  model: {
    vatPrice?: number;
    price?: number;
    vatRate: number;
  };
  vatPrices: boolean;
}>();

const editablePrice = computed(() => {
  return props.vatPrices ? props.model.vatPrice : props.model.price;
});

watch(editablePrice, price => {
  setPrices(price);
});

function setPrices(price) {
  const { vatPrices, model: { vatRate } } = props;
  const otherField = vatPrices ? 'price' : 'vatPrice';
  const fn = vatPrices ? v => v / (1.0 + vatRate) : v => v * (1.0 + vatRate);
  // eslint-disable-next-line vue/no-mutating-props
  props.model[otherField] = round(fn(price), 2);
}

</script>
<style scoped lang="scss">
.el-form-item {
  text-align: right;
}
</style>
