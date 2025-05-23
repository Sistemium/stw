<template lang="pug">

v-list.storages-list.text-left(
  density="compact"
  border
)
  v-list-item(
    v-for="storage in storages"
    :key="storage.id"
    @click="emit('click', storage)"
    :title="storage.name"
  )
    template(#append)
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
