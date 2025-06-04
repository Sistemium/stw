<template lang="pug">
v-sheet
  h3.ma-4
    localized-string-view(:localized="report.title")
  v-list(density="compact" v-if="report.comments.length")
    v-list-item(
      v-for="(comment, idx) in report.comments"
      :key="idx"
    )
      template(#subtitle)
        v-list-item-subtitle
          localized-string-view(:localized="comment.label")
      template(#title)
        span {{ comment.text }}
  assistant-report-table(:report="report")
</template>
<script setup lang="ts">
import type { MongoReportResult } from '@/services/prompting'
import LocalizedStringView from '@/components/LocalizedStringView.vue'
import AssistantReportTable from '@/components/assistant/AssistantReportTable.vue'

const { report } = defineProps<{
  report: MongoReportResult
}>()

</script>
