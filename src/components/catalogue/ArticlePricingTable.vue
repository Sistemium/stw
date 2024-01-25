<template lang="pug">

  .article-pricing-table
    el-table-v2(
      :key="width"
      v-if="width"
      :columns="columns"
      :data="articlePricing"
      :width="width"
      :height="height"
      fixed
      :estimated-row-height="50"
      :row-event-handlers="{ onClick: handleCLick }"
    )

</template>

<script setup lang="tsx">
import { computed, watch } from 'vue'
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue'
import type { IArticlePricing } from '@/models/ArticlePricing'
import { t, tn } from '@/lib/validations'
import type { Column } from 'element-plus'
import max from 'lodash/max'
import ArticleView from '@/components/catalogue/ArticleView.vue'

const props = withDefaults(defineProps<{
  articlePricing: IArticlePricing[]
  height?: number
  width?: number
  columnWidth?: number
}>(), { columnWidth: 150, width: 0 })

interface ColumnInfo {
  width: number
  key?: string
  dataKey?: string
}

const emit = defineEmits<{
  (e: 'avatarClick', row: IArticlePricing): void
  (e: 'rowClick', row: IArticlePricing): void
  (e: 'resize', columns: ColumnInfo[]): void
}>()

const columns = computed<Column[]>(() => {
  const count = 1
  const { columnWidth } = props
  const nameWidth = max([props.width - columnWidth * count - 6 - 60, 250]) || 0
  const width = max([Math.floor((props.width - nameWidth - count - 60) / count), 150]) || 0
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
      align: 'left',
      key: 'article',
      title: t('concepts.article'),
      width: nameWidth,
      cellRenderer: ({ rowData }) => <ArticleView article-id={rowData.articleId} />,
    },
    {
      width,
      align: 'right',
      title: t('fields.price'),
      dataKey: 'price',
      minWidth: 60,
      cellRenderer: ({ cellData }) => <span>{tn(cellData, 'decimal')}</span>,
    },
  ]
})

watch(columns, (cols: Column[]) => {
  const res = cols.map(({ width, key, dataKey }) => ({
    width,
    key: key || String(dataKey),
    dataKey: String(dataKey),
  }))
  emit('resize', res)
})

function handleCLick({ rowData }: { rowData: IArticlePricing }) {
  emit('rowClick', rowData)
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.article-pricing-table :deep(.article) {
  word-break: normal !important;
  padding: 6px;
}

.article-pricing-table {
  text-align: left;
}

</style>
