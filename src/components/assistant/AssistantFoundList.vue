<template lang="pug">
v-list(v-if="prompt" density="compact")
  v-list-item
    v-list-subheader
      v-icon $mdiMessageOutline
      span.ml-3 {{ prompt.query }}
    template(#append)
      v-btn(
        variant="flat"
        icon="$mdiClose"
        density="compact"
        size="small"
        @click="emit('close')"
      )
  v-list-item(
    v-if="!prompt.results.length"
    :title="$t('validation.noData')"
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
        @click="toggleItem(result)"
      ) {{ result.selected ? $t('remove') : $t('add') }}
        template(#prepend)
          v-icon(v-if="result.selected" size="large") $mdiCheck
  v-sheet(
    v-for="report in reports"
    :key="report.id"
  )
    h3.ma-3 {{ report.name }}
    assistant-report-table(
      :report="report.report"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PromptData, SearchResult } from '@/services/prompting'
import { safeT } from '@/services/i18n'
import AssistantReportTable from '@/components/assistant/AssistantReportTable.vue'

const selected = defineModel({ default: new Map<string, SearchResult>() })

const props = defineProps<{
  prompt: PromptData
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const entityResults = computed(() => props.prompt.results.filter(r => r.entityType !== 'report'))

const fullResults = computed(() => entityResults.value.map(res => ({
  ...res,
  selected: selected.value.has(res.id),
})))

const reports = computed(() => props.prompt.results.filter(r => r.entityType === 'report'))


function toggleItem(result: SearchResult) {
  const { id } = result
  const has = selected.value.has(id)
  if (has) {
    selected.value.delete(id)
  } else {
    selected.value.set(id, result)
  }
}
</script>
