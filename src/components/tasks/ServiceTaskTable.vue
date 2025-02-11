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
import { type IServiceTask, serviceTaskWorkflow } from '@/models/ServiceTask'
import Employee from '@/models/Employee'
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue'
import ServicePointCustomer from '@/models/ServicePointCustomer'

const props = withDefaults(defineProps<{
  serviceTasks: IServiceTask[]
  height?: number
  width?: number
  columnWidth?: number
}>(), {
  columnWidth: 70,
  width: 0,
})


const emit = defineEmits<{
  (e: 'editClick', row: IServiceTask): void
  (e: 'resize', columns: ColumnInfo[]): void
}>()


const columns = computed(() => {
  const count = 6
  const { columnWidth } = props
  const nameWidth = max([props.width - columnWidth * count - 6 - 300, 300]) || 0
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
      align: 'center',
      title: t('fields.processing'),
      dataKey: 'processing',
      // minWidth: 60,
      cellRenderer: ({ rowData }) =>
        <WorkflowProcessing
          workflow={serviceTaskWorkflow}
          processing={rowData.processing}
          size="small"
          disabled
        ></WorkflowProcessing>,
    },
    {
      width: nameWidth,
      // minWidth: nameWidth,
      align: 'left',
      title: t('fields.description'),
      dataKey: 'description',
      class: 'description',
    },
    {
      width: width * 3,
      // minWidth: nameWidth,
      align: 'left',
      title: t('fields.customer'),
      key: 'servicePointId',
      cellRenderer({ rowData }) {
        const c = ServicePointCustomer.reactiveGet(rowData.servicePointId)
        return <div class="text-left">
          <div>{c?.name}</div>
          <small>{c?.address}</small>
        </div>
      },
    },
    {
      width,
      align: 'left',
      title: t('fields.assignee'),
      dataKey: 'date',
      // minWidth: 60,
      cellRenderer: ({ rowData }) =>
        <div class="text-left">{Employee.reactiveGet(rowData.assigneeId)?.name}</div>,
    },
    {
      key: 'buttons',
      width: 60,
      // minWidth: 100,
      align: 'right',
      cellRenderer: ({ rowData }) =>
        <ToolButton
          tool="edit"
          circle={false}
          onClick={() => emit('editClick', rowData)}>
        </ToolButton>,
    },
  ] as ColumnInfo<IServiceTask>[]
})


</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
small {
  color: $gray;
}
.service-task-table::v-deep(.description > div) {
  white-space: normal;
  text-align: left;
  //font-size: small;
}
</style>
