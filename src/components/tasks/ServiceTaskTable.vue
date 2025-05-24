<template lang="pug">
v-data-table-virtual.service-task-table.text-left(
  :headers="columns"
  :items="serviceTasks"
  fixed-header
  :height="height"
  :row-props="rowProps"
  hover
)

  template(#item.date="{ value }") {{ $d(value) }}
  template(#item.processing="{ value }")
    workflow-processing(
      :workflow="serviceTaskWorkflow"
      :processing="value"
      size="small"
      disabled
    )
  template(#item.servicePointId="{ value }")
    customer-name(:customer-id="value")
  template(#item.assigneeId="{ value }")
    | {{ Employee.reactiveGet(value)?.name }}
  template(#item.events="{ item }")
    service-task-events-info(
      :service-task-id="item.id"
      @click="() => emit('showHistoryClick', item)"
    )
  template(#item.buttons="{ item }")
    tool-button(
      tool="edit"
      :circle="false"
      @click="() => emit('editClick', item)"
    )
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { t } from '@/lib/validations'
import ToolButton from '@/lib/ToolButton.vue'
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue'
import CustomerName from '@/components/contacts/CustomerName.vue'
import { type IServiceTask, serviceTaskWorkflow } from '@/models/ServiceTask'
import Employee from '@/models/Employee'
import ServiceTaskEventsInfo from '@/components/tasks/ServiceTaskEventsInfo.vue'
import { useRowProps } from '@/services/util'

const props = withDefaults(defineProps<{
  serviceTasks: IServiceTask[]
  height?: number
  width?: number
  columnWidth?: number
  activeId?: string
}>(), {
  columnWidth: 70,
  width: 0,
})


const emit = defineEmits<{
  (e: 'editClick', row: IServiceTask): void
  (e: 'showHistoryClick', row: IServiceTask): void
}>()

const rowProps = useRowProps(props)

const columns = computed(() => [
  {
    width: 110,
    title: t('fields.date'),
    key: 'date',
  },
  {
    align: 'center',
    title: t('fields.processing'),
    key: 'processing',
  },
  {
    // width: 250,
    title: t('fields.description'),
    key: 'description',
    class: 'description',
  },
  {
    width: 300,
    title: t('fields.customer'),
    key: 'servicePointId',
  },
  {
    title: t('fields.assignee'),
    key: 'assigneeId',
  },
  {
    align: 'center',
    title: t('fields.events'),
    key: 'events',
  },
  {
    key: 'buttons',
    width: 60,
    align: 'end',
  },
])


</script>
