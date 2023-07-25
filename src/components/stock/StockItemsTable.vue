<template lang="pug">

el-table.stock-items-table(
  :data="data"
  :height="height"
  @row-click="(row, column) => emit('rowClick', row, column)"
)
  el-table-column(
    prop="date"
    :label="$t('fields.date')"
    :width="columnWidth"
  )
    template(#default="{ row }")
      span {{ $ts(row.date, 'short') }}
  el-table-column(
    :label="$t('concepts.article')"
  )
    template(#default="{ row }")
      article-view(:article-id="row.articleId")
  el-table-column(
    prop="units"
    :label="$t('fields.units')"
    :width="columnWidth"
  )

</template>
<script setup lang="ts">

import ArticleView from '@/components/catalogue/ArticleView.vue';
import type { StockOperationReportItem } from '@/services/stockoperating';

withDefaults(defineProps<{
  data: StockOperationReportItem[];
  height?: number;
  columnWidth?: number;
}>(), { columnWidth: 120 });

const emit = defineEmits<{
  (e: 'rowClick', row: StockOperationReportItem, column: object): void;
}>();

</script>
<style scoped lang="scss">

.stock-items-table :deep(.cell) {
  word-break: normal;
}

.el-table :deep(td) {
  cursor: pointer;
}

</style>
