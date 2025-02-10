<template lang="pug">
.service-task-history-list
  el-timeline
    el-timeline-item(
      v-for="item in history"
      :key="item.id"
      :timestamp="`${$ts(item.timestamp, 'minutes')}, ${item.author}`"
      placement="top"
    )
      workflow-processing(
        v-if="item.processing"
        :processing="item.processing"
        :workflow="serviceTaskWorkflow"
        size="small"
      )
      el-descriptions(
        direction="horizontal"
        :column="1"
        size="small"
        :border="true"
      )
        el-descriptions-item(
          v-if="item.assignee"
          :label="$t('fields.assigned')"
          align="right"
          label-align="left"
        ) {{ item.assignee }}
        el-descriptions-item(
          v-if="item.comment"
          :label="$t('fields.comment')"
          align="right"
          label-align="left"
        ) {{ item.comment }}

</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import ServiceTaskHistory, { type IServiceTaskHistory } from '@/models/ServiceTaskHistory.ts'
import orderBy from 'lodash/orderBy'
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue'
import { serviceTaskWorkflow } from '@/models/ServiceTask.ts'
import { loadRelation } from '@/services/util.ts'
import User from '@/models/User.ts'
import Employee from '@/models/Employee.ts'

const props = defineProps<{
  serviceTaskId?: string
}>()

type RichHistory = IServiceTaskHistory & {
  author?: string
  assignee?: string
}

const history = computed<RichHistory[]>(() =>
  orderBy(ServiceTaskHistory.reactiveFilter({ serviceTaskId: props.serviceTaskId })
    .map(item => ({
      ...item,
      author: User.reactiveGet(item.authId)?.name,
      assignee: Employee.reactiveGet(item.assigneeId)?.name,
    })), 'timestamp', 'desc'),
)

watch(() => props.serviceTaskId, serviceTaskId => {
  ServiceTaskHistory.cachedFetch({ serviceTaskId })
    .then(fetched => loadRelation(User, fetched, 'authId'))
}, { immediate: true })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.el-timeline {
  padding-inline-start: 1px;
}

.el-descriptions {
  margin-top: 1em;
}
</style>
