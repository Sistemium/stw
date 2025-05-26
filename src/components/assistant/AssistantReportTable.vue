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
        //span(v-if="column.dataType === 'number'") {{ safeN(item[column.name]) }}
        //span(v-else) {{ item[column.name] }}
</template>

<script setup lang="ts">
import { type AssistantReport } from '@/services/prompting'
import { computed } from 'vue'
import { safeN } from '@/services/i18n'

const { report } = defineProps<{
  report: AssistantReport
}>()

const headers = computed(() => report.columns.map(column => ({
  key: column.name,
  title: column.name,
  align: column.dataType === 'number' ? 'end' : 'start',
  cls: column.dataType === 'number' ? 'text-right' : '',
  render: column.dataType === 'number' ? safeN : x => x,
})))


</script>
