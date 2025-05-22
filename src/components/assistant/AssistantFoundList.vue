<template lang="pug">
.list-group(v-if="results")
  el-alert(
    v-if="!results.length"
    :title="$t('validation.noData')"
    @close="emit('close')"
  )
  .list-group-item.d-flex(
    v-for="result in results"
    :key="result.id"
  )
    strong {{ safeT(result.entityType, 'fields') }}
    span.ml-2 {{ result.name }}
</template>

<script setup lang="ts">
import type { SearchResult } from '@/services/prompting'
import { safeT } from '@/i18n'

defineProps<{
  results: SearchResult[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
