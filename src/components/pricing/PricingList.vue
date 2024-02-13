<template lang="pug">
.pricing-list.list-group
  .list-group-item(
    v-for="p in pricing"
    :key="p.id"
    @click="emit('click', p)"
  )
    .title {{ p.name }}
      .subtitle
        simple-label(:text="p.vatPrices ? 'fields.withVat' : 'fields.withoutVat'")
    tool-button(
      tool="edit"
      @click.stop="emit('editClick', p)"
    )
</template>

<script setup lang="ts">
import { type IPricing } from '@/models/Pricing'
import SimpleLabel from '@/lib/SimpleLabel.vue'
import ToolButton from '@/lib/ToolButton.vue'

defineProps<{
  pricing: IPricing[]
}>()

const emit = defineEmits<{
  (e: 'click', item: IPricing): void,
  (e: 'editClick', item: IPricing): void,
}>()

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.list-group-item {
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
