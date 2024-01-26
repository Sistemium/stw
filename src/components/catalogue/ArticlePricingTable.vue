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
      template(#empty)
        alert-empty

</template>

<script setup lang="tsx">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue'
import type { IArticlePricing } from '@/models/ArticlePricing'
import { t, tn, td } from '@/lib/validations'
import type { Column } from 'element-plus'
import max from 'lodash/max'
import ArticleView from '@/components/catalogue/ArticleView.vue'
import { useEnter } from '@/services/validating'
import AlertEmpty from '@/lib/AlertEmpty.vue'

const props = withDefaults(defineProps<{
  articlePricing: IArticlePricing[]
  height?: number
  width?: number
  columnWidth?: number
  editing: boolean
  date: string
}>(), {
  columnWidth: 150,
  width: 0,
  editing: false,
})

interface ColumnInfo {
  width: number
  key?: string
  dataKey?: string
}

const emit = defineEmits<{
  (e: 'avatarClick', row: IArticlePricing): void
  (e: 'rowClick', row: IArticlePricing): void
  (e: 'resize', columns: ColumnInfo[]): void
  (e: 'priceChange', articleId: string, price?: number): void
}>()

const columns = computed<Column[]>(() => {
  const count = 3
  const { columnWidth } = props
  const nameWidth = max([props.width - columnWidth * count - 6 - 60, 250]) || 0
  const width = max([Math.floor((props.width - nameWidth - 6 - 60) / count), 150]) || 0
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
      align: 'center',
      title: t('fields.startsFrom'),
      dataKey: 'date',
      minWidth: 60,
      cellRenderer: renderDate,
    },
    {
      width,
      align: 'center',
      title: t('fields.commentText'),
      dataKey: 'masterId',
      minWidth: 60,
      cellRenderer: renderComment,
    },
    {
      width,
      align: 'center',
      title: t('fields.price'),
      dataKey: 'price',
      minWidth: 60,
      cellRenderer: props.editing ? renderInput : renderSpan,
    },
  ]
})

const priceMap = reactive<Map<string, number>>(new Map())

const { t: localT } = useI18n({
  messages: {
    en: {
      masterSpecial: 'Special for the employee',
      siteSpecial: 'Department special',
    },
    lt: {
      masterSpecial: 'Ypatinga darbuotojui',
      siteSpecial: 'Padalinio kaina',
    },
    ru: {
      masterSpecial: 'Специальная для сотрудника',
      siteSpecial: 'Цена в филиале',
    },
  },
});

watch(props.articlePricing, articlePricing => {
  articlePricing.forEach(ap => {
    priceMap.set(ap.articleId, ap.price)
  })
})

useEnter((e: EventTarget | null) => {
  if (e && document.activeElement === e) {
    e.blur()
  }
})

function renderSpan({ cellData }: { cellData: any }) {
  return <span>{tn(cellData, 'decimal')}</span>
}

function renderDate({ cellData }: { cellData: string }) {
  if (!cellData || cellData === props.date) {
    return <span></span>
  }
  return <span>{td(cellData, 'short')}</span>
}

function renderComment({ rowData }: { rowData: IArticlePricing }) {
  const res = []
  if (rowData.masterId) {
    res.push(<small>{localT('masterSpecial')}</small>)
  }
  if (rowData.siteId) {
    res.push(<small>{localT('siteSpecial')}</small>)
  }
  return res
}

function renderInput({ cellData, rowData }: { cellData: any, rowData: IArticlePricing }) {
  return <el-input-number
    controls={false}
    v-select-on-focus
    model-value={cellData}
    onUpdate:modelValue={(p: number) => priceMap.set(rowData.articleId, p)}
    onFocus={() => onPriceFocus(rowData.articleId)}
    onBlur={() => onPriceBlur(rowData.articleId)}
  ></el-input-number>
}

const editingArticle: { articleId: string, price?: number | null } = {
  articleId: '',
  price: undefined,
}

function onPriceFocus(articleId: string) {
  editingArticle.articleId = articleId
  editingArticle.price = priceMap.get(articleId)
}

function onPriceBlur(articleId: string) {
  const price = priceMap.get(articleId)
  if (editingArticle.price !== price) {
    emit('priceChange', articleId, price)
  }
}

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

.alert-empty {
  margin-top: $margin;
}

</style>
