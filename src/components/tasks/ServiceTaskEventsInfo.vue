<template lang="pug">
.service-task-events-info(
  v-if="lastEvent"
)
  el-button(
    link
    type="primary"
    @click="emit('click')"
  )
    .info
      small.ts {{ $ts(lastEvent.timestamp, 'minutes') }}
      small.type(v-if="typeLabel") {{ $t(typeLabel) }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskHistory } from '@/services/serving'

const props = defineProps<{
  serviceTaskId: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const { history } = useTaskHistory(props)
const lastEvent = computed(() => history.value[0])
const typeLabel = computed(() => {
  const { value } = lastEvent
  if (!value) {
    return ''
  }
  const { type, assigneeId, processing } = value
  if (type === 'create') {
    return 'fields.created'
  }
  if (type === 'comment') {
    return 'fields.comment'
  }
  if (assigneeId) {
    return  'workflow.assigned'
  }
  if (assigneeId) {
    return  'workflow.assigned'
  }
  return `workflow.${processing}`
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.service-task-events-info .info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.25;
}
</style>
