<template lang="pug">
v-list(v-if="prompt" density="compact")
  v-list-item
    v-list-subheader
      v-icon $mdiMessageOutline
      span.ml-3 {{ prompt.query }}
    template(#append)
      tool-button(
        tool="refresh"
        variant="flat"
        color=""
        density="compact"
        size="small"
        @click="emit('refresh')"
      )
      v-btn.ml-2(
        variant="flat"
        icon="$mdiClose"
        density="compact"
        size="small"
        @click="emit('close')"
      )
  v-list-item(
    v-if="isEmpty && !prompt.loading"
    :title="prompt.error || $t('validation.noData')"
  )
  v-list-item(v-if="prompt.loading && isEmpty")
    v-skeleton-loader.ma-2(type="paragraph")
  busy-loading(v-if="prompt.loading && !isEmpty" :busy="prompt.loading")
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
import type { SearchResult, UnwrappedPrompt } from '@/services/prompting'
import { safeT } from '@/services/i18n'
import AssistantReportTable from '@/components/assistant/AssistantReportTable.vue'
import ToolButton from '@/lib/ToolButton.vue'
import BusyLoading from '@/lib/BusyLoading.vue'

const selected = defineModel({ default: new Map<string, SearchResult>() })

const props = defineProps<{
  prompt: UnwrappedPrompt
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'refresh'): void
}>()

const entityResults = computed(() => props.prompt.results.filter(r => r.entityType !== 'report') || [])

const fullResults = computed(() => entityResults.value.map(res => ({
  ...res,
  selected: selected.value.has(res.id),
})))

const reports = computed(() => props.prompt.results.filter(r => r.entityType === 'report') || [])

const isEmpty = computed(() => !props.prompt.results.length)

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
