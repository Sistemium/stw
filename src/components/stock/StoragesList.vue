<template lang="pug">

.storages-list.list-group
  .list-group-item(
    v-for="storage in storages"
    :key="storage.id"
    @click="emit('click', storage)"
  )
    .name {{ storage.name }}
    simple-label(:text="`concepts.${storage.type}`")

</template>
<script setup lang="ts">

import SimpleLabel from '@/lib/SimpleLabel.vue'
import type { IStorage } from '@/models/Storage'

defineProps<{
  storages: IStorage[]
}>()

const emit = defineEmits<{
  (e: 'click', storage: IStorage): void
}>()

</script>
<style scoped lang="scss">

.list-group-item {
  display: flex;
  justify-content: space-between;
}

</style>
