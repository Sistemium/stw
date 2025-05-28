<template lang="pug">
v-data-table(
  density="compact"
  :headers
  :items="report.data"
)
  template(#item="{ item }")
    tr
      td(
        v-for="column in headers"
        :key="column.key"
        :class="column.cls"
      ) {{ column.render(item[column.key]) }}
</template>

<script setup lang="ts">
import { type AssistantReport } from '@/services/prompting'
import { computed } from 'vue'
import { safeN, safeTd } from '@/services/i18n'

const { report } = defineProps<{
  report: AssistantReport
}>()

const headers = computed(() => report.columns.map(column => ({
  key: column.dataKey,
  title: column.title,
  align: aligners[column.dataType] || 'start',
  cls: aligners[column.dataType] === 'end' ? 'text-right' : '',
  render: renderers[column.dataType] || (x => x),
})))

const renderers = {
  number: safeN,
  currency: (x: number) => safeN(x, 'currency'),
  date: (d: string) => safeTd(d, 'short'),
}

const aligners = {
  number: 'end',
  currency: 'end',
}

</script>
