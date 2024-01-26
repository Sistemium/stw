<template lang="pug">
  el-select.pricing-select(
    :model-value="pricingId"
    :clearable="true"
    :placeholder="$t('actions.select', [$t('accusative.pricing')])"
    @update:model-value="id => { pricingId = id }"
  )
    el-option(
      v-for="o in options"
      :key="o.id"
      :value="o.id"
      :label="o.name"
    )
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import Pricing from '@/models/Pricing'
import { orderByName } from '@/services/util'

const options = computed(() => orderByName(Pricing.reactiveFilter()))
const pricingId = defineModel<string>()

watch(options, o => {
  if (o.length === 1) {
    pricingId.value = o[0].id
  }
}, { immediate: true })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.pricing-select {
  width: 200px;
}
</style>
