<template lang="pug">
.service-task-events-info(v-if="lastEvent")
  small.ts {{ $ts(lastEvent.timestamp, 'minutes') }}
  small.type(v-if="typeLabel") {{ $t(typeLabel) }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskHistory } from '@/services/serving'

const props = defineProps<{
  serviceTaskId: string
}>()

const { history } = useTaskHistory(props)
const lastEvent = computed(() => history.value[0])
const typeLabel = computed(() => {
  const { value } = lastEvent
  if (!value) {
    return ''
  }
  const { type, assigneeId } = value
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
  return ''
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.service-task-events-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
