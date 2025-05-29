<template lang="pug">
v-list(v-if="prompt" density="compact")
  v-list-item
    v-list-subheader
      v-icon $mdiMessageOutline
      span.ml-3.text-wrap {{ prompt.query }}
    template(#append)
      small.duration.text-grey-darken-3 {{ $d(prompt.startedAt, 'timestamp') }}
      small.duration.text-grey-darken-3.ml-1(v-if="prompt.duration") + {{ prompt.duration }} {{ $t('shortened.seconds') }}
      tool-button.ml-2(
        tool="copy"
        variant="flat"
        color=""
        density="compact"
        size="small"
        @click="emit('copy')"
      )
      tool-button.ml-2(
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
    template(#prepend)
      v-icon(
        :color="prompt.error ? 'error' : ''"
      ) $mdiAlertCircle
  v-list-item(v-if="prompt.loading && isEmpty")
    v-skeleton-loader.ma-2(type="paragraph")
  busy-loading(v-if="prompt.loading && !isEmpty" :busy="prompt.loading")
  template(v-for="type in entityResults" :key="type.entityType")
    v-list-subheader
      template(#default)
        h4 {{ safeT(type.entityType, 'fields') }}
    v-divider
    v-list-item(
      v-for="result in type.data"
      :key="result.id"
      :title="result.name"
    )
      template(#subtitle)
        span(v-if="result.code") {{ result.code }}
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
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

const selected = defineModel({ default: new Map<string, SearchResult>() })

const props = defineProps<{
  prompt: UnwrappedPrompt
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'refresh'): void
  (e: 'copy'): void
}>()

const entityResults = computed(() => {
  const results = props.prompt.results.filter(r => r.entityType !== 'report')
    .map(res => ({
      ...res,
      selected: selected.value.has(res.id),
    }))
  const grouped = groupBy<SearchResult>(results, 'entityType')
  return map(grouped, (data, entityType) => ({ entityType, data })) as { data: SearchResult[], entityType: string }[]
})

const reports = computed(() => props.prompt.results.filter(r => r.report))

const isEmpty = computed(() => !reports.value.length && !entityResults.value.length)

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
