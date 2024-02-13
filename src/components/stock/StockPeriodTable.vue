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
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';
import { t, tn } from '@/lib/validations';
import type { Column } from 'element-plus'
import type { IStockArticleDate } from '@/models/StockArticleDate'

const props = withDefaults(defineProps<{
  data: IStockArticleDate[];
  height?: number;
  width?: number;
  columnWidth?: number;
}>(), { columnWidth: 120 });

const emit = defineEmits<{
  (e: 'avatarClick', row: object): void;
  (e: 'rowClick', row: IStockArticleDate): void;
}>();

const columns = computed<Column[]>(() => {
  const { columnWidth } = props;
  const nameWidth = max([props.width - columnWidth * 6 - 6, 250]);
  const width = max([Math.floor((props.width - nameWidth - 6 - 60) / 6), 50]);
  return [
    {
      key: 'avatar',
      title: '',
      width: 60,
      cellRenderer: ({ rowData }) =>
        <ArticleAvatar
          article-id={rowData.articleId}
          onClick={(e: Event) => {
            e.stopPropagation()
            emit('avatarClick', rowData)
          }}
        ></ArticleAvatar>,
    },
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
      minWidth: 60,
      title: t('fields.cost'),
      dataKey: 'resultCost',
      cellRenderer: ({ cellData }) => <span>{tn(cellData, 'decimal')}</span>,
    },
  ]
});


function handleCLick({ rowData }) {
  emit('rowClick', rowData as IStockArticleDate);
}

</script>
<style scoped lang="scss">

.stock-period-table :deep(.article) {
  word-break: normal !important;
  padding: 6px;
}

.stock-period-table {
  text-align: left;
}
</style>
