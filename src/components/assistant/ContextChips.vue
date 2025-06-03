<template lang="pug">
v-chip.mr-2(
  v-for="item in context"
  :key="item.id"
  closable
  size="small"
  @click:close="emit('click:close', item.id)"
) {{ item.label }}
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean
  context?: { id: string, label: string }[]
}>()
const emit = defineEmits<{
  (e: 'click:close', id: string): void
}>()
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
