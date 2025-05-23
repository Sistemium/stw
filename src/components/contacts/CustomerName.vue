<template lang="pug">
.text-left
  .name {{ customer?.name }}
  small.text-grey-darken-3 {{ customer?.address }}
</template>

<script setup lang="ts">
import ServicePointCustomer from '@/models/ServicePointCustomer'
import { computed } from 'vue'

const { customerId } = defineProps<{
  customerId?: string
}>()

const customer = computed(() => ServicePointCustomer.reactiveGet(customerId))

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
