<template lang="pug">

el-table-v2.stock-period-table(
  :key="width"
  v-if="width"
  :columns="columns"
  :data="data"
  :width="width"
  :height="height"
  fixed
  :estimated-row-height="50"
  :row-event-handlers="{ onClick: handleCLick }"
)

</template>
<script setup lang="tsx">
import max from 'lodash/max';
import { computed } from 'vue';
import ArticleView from '@/components/catalogue/ArticleView.vue';
import type StockArticleDate from '@/models/StockArticleDates';
import { t, tn } from '@/lib/validations';
import type { Column } from 'element-plus'

const props = withDefaults(defineProps<{
  data: StockArticleDate[];
  height?: number;
  width?: number;
  columnWidth?: number;
}>(), { columnWidth: 120 });

const emit = defineEmits<{
  (e: 'rowClick', row: StockArticleDate): void;
}>();

const columns = computed<Column[]>(() => {
  const { columnWidth } = props;
  const nameWidth = max([props.width - columnWidth * 6 - 6, 120]);
  const width = Math.floor((props.width - nameWidth - 6) / 6);
  return [
    {
      class: 'article',
      key: 'article',
      title: t('concepts.article'),
      width: nameWidth,
      cellRenderer: ({ rowData }) => <ArticleView article-id={rowData.articleId}/>,
    },
    {
      width,
      title: t('fields.initUnits'),
      dataKey: 'initUnits',
    },
    {
      width,
      title: t('fields.unitsIn'),
      dataKey: 'unitsIn',
    },
    {
      width,
      title: t('fields.unitsOut'),
      dataKey: 'unitsOut',
    },
    {
      width,
      title: t('fields.unitsSur'),
      dataKey: 'unitsSur',
    },
    {
      width,
      title: t('fields.remains'),
      dataKey: 'resultUnits',
    },
    {
      align: 'right',
      width,
      title: t('fields.cost'),
      dataKey: 'resultCost',
      cellRenderer: ({ cellData }) => <span>{ tn(cellData, 'decimal') }</span>,
    },
  ]
});


function handleCLick({ rowData }) {
  emit('rowClick', rowData as StockArticleDate);
}

</script>
<style scoped lang="scss">

.stock-period-table :deep(.article) {
  word-break: normal !important;
}

.stock-period-table {
  text-align: left;
}
</style>
