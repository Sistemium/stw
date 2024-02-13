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
import { useSetPrices } from '@/services/pricing'

const props = defineProps<{
  model: {
    vatPrice?: number | null;
    price?: number | null;
    vatRate?: number;
  };
  vatPrices: boolean;
}>();

const editablePrice = computed<number | undefined | null>(() => {
  return props.vatPrices ? props.model.vatPrice : props.model.price;
});

const { setOtherPrice } = useSetPrices(props)

watch(editablePrice, (price?: number | null) => {
  const { vatPrices, model: { vatRate = 0 } } = props;
  setOtherPrice(vatPrices, vatRate, price)
});

</script>
<style scoped lang="scss">
.el-form-item {
  text-align: right;
}
</style>
