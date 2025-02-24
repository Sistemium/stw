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
        .actions(v-if="item.comment")
          el-descriptions-item(
            :label="$t('fields.comment')"
            align="right"
            label-align="left"
          )
            .text {{ item.comment }}
            .actions
              confirm-button(
                size="small"
                type="warning"
                link
                @confirm="deleteClick(item.id)"
                :text="$t('delete')"
              ) // need authorize deletion

</template>

<script setup lang="ts">
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue'
import { serviceTaskWorkflow } from '@/models/ServiceTask'
import { useTaskHistory } from '@/services/serving.ts'
import ConfirmButton from 'sistemium-vue/components/ConfirmButton.vue'

const props = defineProps<{
  serviceTaskId?: string
}>()

const { history } = useTaskHistory(props)
const emit = defineEmits<{
  (e: 'deleteComment', id: string): void
}>()

function deleteClick(id: string) {
  emit('deleteComment', id)
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.el-timeline {
  padding-inline-start: 1px;
}

.el-descriptions {
  margin-top: 1em;
}

.actions {
  text-align: left;
}
</style>
