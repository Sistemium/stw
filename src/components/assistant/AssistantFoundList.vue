<template lang="pug">
v-list(v-if="results" density="compact")
  v-list-item(
    v-if="!results.length"
    :title="$t('validation.noData')"
  )
    template(#append)
      v-btn(
        icon="$mdiClose"
        variant="tonal"
        size="small"
        @click="emit('close')"
      )
  v-list-item(
    v-for="result in fullResults"
    :key="result.id"
    :title="result.name"
    :subtitle="safeT(result.entityType, 'fields')"
  )
    template(#append)
      v-btn(
        type="success"
        size="small"
        density="comfortable"
        variant="tonal"
        :color="result.selected ? 'success' : ''"
        @click="toggleItem(result.id)"
      ) {{ result.selected ? $t('remove') : $t('add') }}
        template(#prepend)
          v-icon(v-if="result.selected" size="large") $mdiCheck
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SearchResult } from '@/services/prompting'
import { safeT } from '@/services/i18n'

const selected = defineModel({ default: [] })

const props = defineProps<{
  results: SearchResult[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const fullResults = computed(() => props.results.map(res => ({
  ...res,
  selected: selected.value.includes(res.id),
})))

function toggleItem(id: string) {
  const idx = selected.value.indexOf(id)
  if (idx === -1) {
    selected.value.push(id)
  } else {
    selected.value.splice(idx, 1)
  }
}
</script>
