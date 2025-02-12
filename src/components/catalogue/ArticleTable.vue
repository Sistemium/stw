<template lang="pug">
.article-table(:style="{ height: `${height}px`}")
  el-auto-resizer
    template(#default="{ height: tableHeight, width }")
      watch-emitter(
        :value="width"
        @change="value => {tableWidth = value}"
      )
      el-table-v2(
        v-if="tableWidth"
        ref="tableInstance"
        :key="tableWidth"
        :columns="columns"
        :data="articles"
        :width="tableWidth"
        :height="tableHeight"
        fixed
        :estimated-row-height="50"
        :row-event-handlers="{ onClick: handleCLick }"
        :row-class="({ rowData }) => rowData.id === selectedId && 'active'"
      )
</template>
<script setup lang="tsx">

import { computed, ref } from 'vue'
import max from 'lodash/max'
import type { TableV2Instance, Column } from 'element-plus'
import ToolButton from '@/lib/ToolButton.vue'
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue'
import { t } from '@/lib/validations'
import WatchEmitter from '@/lib/WatchEmitter.vue'
import type { BaseItem } from '@/init/Model'
import type { IArticle } from '@/models/Articles'
import type { IArticleProp } from '@/models/ArticleProps'

const props = defineProps<{
  articles: IArticle[],
  propColumns: IArticleProp[],
  size?: string;
  height?: number;
  selectedId?: string;
}>()

const emit = defineEmits<{
  (e: 'avatarClick', row: BaseItem): void;
  (e: 'click', row: BaseItem): void;
  (e: 'currentChange', current: BaseItem): void;
}>()

const tableWidth = ref(0)
const tableInstance = ref<TableV2Instance>()

const columns = computed<Column[]>(() => {
  const fullWidth = max([tableWidth.value, 900]) as number - 60 - 50 - 6
  const colNumber = props.propColumns.length + 2
  const colWidth = Math.floor(fullWidth / colNumber)
  const nameWidth = fullWidth - colWidth * (colNumber - 1)
  return [
    {
      key: 'avatar',
      title: '',
      width: 60,
      cellRenderer: ({ rowData }) =>
        <ArticleAvatar
          article={rowData}
          onClick={() => emit('avatarClick', rowData)}
        ></ArticleAvatar>,
    },
    {
      align: 'left',
      key: 'name',
      title: t('fields.name'),
      dataKey: 'name',
      width: nameWidth,
    },
    {
      key: 'code',
      title: t('fields.code'),
      dataKey: 'code',
      width: colWidth,
    },
    ...props.propColumns.map(prop => ({
      key: prop.id,
      title: prop.name,
      dataKey: prop.id,
      width: colWidth,
      align: prop.align,
    })),
    {
      key: 'buttons',
      width: 50,
      align: 'right',
      cellRenderer: ({ rowData }) =>
        <ToolButton
          tool="edit"
          circle={false}
          onClick={() => emit('click', rowData)}>
        </ToolButton>,
    },
  ]
})

defineExpose({
  isReady(): boolean {
    return !!tableInstance.value
  },
  scrollToId(id: string): boolean {
    const idx = props.articles.findIndex(item => item.id === id)
    const { value: table } = tableInstance
    if (idx < 0 || !table) {
      return false
    }
    setTimeout(() => {
      table.scrollToRow(idx ? idx - 1 : 0, 'start')
    }, 100)
    return true
  },
})

function handleCLick({ rowData }: { rowData: IArticle }) {
  emit('currentChange', rowData)
}

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.article-table {
  text-align: left;
}

.article-table :deep(.el-table-v2__row-cell) {
  padding: 6px;
}

.article-table :deep(.el-table-v2__row.active) {
  background: $gray-background;

  .el-table-v2__cell-text {
    color: $primary-color;
  }
}

</style>
