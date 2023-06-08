<template lang="pug">

el-table.stock-period-table(
  :data="data"
  :height="height"
  @row-click="(row, column) => emit('rowClick', row, column)"
)
  el-table-column(
    :label="$t('concepts.article')"
  )
    template(#default="{ row }")
      article-view(:article-id="row.articleId")
  el-table-column(
    prop="initUnits"
    :label="$t('fields.initUnits')"
    :width="columnWidth"
  )
  el-table-column(
    prop="unitsIn"
    :label="$t('fields.unitsIn')"
    :width="columnWidth"
  )
  el-table-column(
    prop="unitsOut"
    :label="$t('fields.unitsOut')"
    :width="columnWidth"
  )
  el-table-column(
    prop="unitsSur"
    :label="$t('fields.unitsSur')"
    :width="columnWidth"
  )
  el-table-column(
    prop="resultUnits"
    :label="$t('fields.remains')"
    :width="columnWidth"
  )
  el-table-column(
    prop="resultCost"
    :label="$t('fields.cost')"
    :width="columnWidth"
  )
    template(#default="{ row }")
      span(v-if="row.resultCost") {{ $n(row.resultCost) }}

</template>
<script setup lang="ts">

import ArticleView from '@/components/catalogue/ArticleView.vue';
import type StockArticleDate from '@/models/StockArticleDates';

withDefaults(defineProps<{
  data: StockArticleDate[];
  height?: number;
  columnWidth?: number;
}>(), { columnWidth: 120 });

const emit = defineEmits<{
  (e: 'rowClick', row: StockArticleDate, column: object): void;
}>();

</script>
<style scoped lang="scss">

.stock-period-table :deep(.cell) {
  word-break: normal;
}

.el-table :deep(td) {
  cursor: pointer;
}

</style>
