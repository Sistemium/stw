<template lang="pug">
.service-task-table
  el-table-v2(
    :key="width"
    v-if="width"
    :columns="columns"
    :data="serviceTasks"
    :width="width"
    :height="height"
    :fixed="true"
  )
    template(#empty)
      alert-empty
</template>

<script setup lang="tsx">

import max from 'lodash/max'
import { computed } from 'vue'
import { t } from '@/lib/validations'
import type { ColumnInfo } from '@/services/util'
import AlertEmpty from '@/lib/AlertEmpty.vue'
import ToolButton from '@/lib/ToolButton.vue'
import { renderDate } from '@/services/rendering'
import type { IServiceTask } from '@/models/ServiceTask'
import Employee from '@/models/Employee'

const props = withDefaults(defineProps<{
  serviceTasks: IServiceTask[]
  height?: number
  width?: number
  columnWidth?: number
}>(), {
  columnWidth: 80,
  width: 0,
})


const emit = defineEmits<{
  (e: 'editClick', row: IServiceTask): void
  (e: 'resize', columns: ColumnInfo[]): void
}>()


const columns = computed<ColumnInfo[]>(() => {
  const count = 3
  const { columnWidth } = props
  const nameWidth = max([props.width - columnWidth * count - 6 - 60 - 190, 250]) || 0
  const width = max([Math.floor((props.width - nameWidth - 6 - 60) / count), columnWidth]) || 0
  // console.log(props.width, { columnWidth, nameWidth, width }, props.width - (nameWidth + width))
  return [
    {
      width,
      align: 'left',
      title: t('fields.date'),
      dataKey: 'date',
      // minWidth: 60,
      cellRenderer: renderDate,
    },
    {
      width,
      align: 'left',
      title: t('fields.processing'),
      dataKey: 'processing',
      // minWidth: 60,
      cellRenderer: ({ rowData }: { rowData: IServiceTask }) =>
        <span>{ t(`workflow.${rowData.processing || 'draft'}`) }</span>,
    },
    {
      width: nameWidth,
      minWidth: nameWidth,
      align: 'left',
      title: t('fields.description'),
      dataKey: 'description',
      // minWidth: 100,
    },
    {
      width,
      align: 'left',
      title: t('fields.assignee'),
      dataKey: 'date',
      // minWidth: 60,
      cellRenderer: ({ rowData }: { rowData: IServiceTask }) =>
        <span>{ Employee.reactiveGet(rowData.assigneeId)?.name }</span>,
    },
    {
      key: 'buttons',
      width: 66,
      // minWidth: 100,
      align: 'right',
      cellRenderer: ({ rowData }: { rowData: IServiceTask }) =>
        <ToolButton
          tool="edit"
          circle={false}
          onClick={() => emit('editClick', rowData)}>
        </ToolButton>,
    },
  ]
})


</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
