<template lang="pug">

el-dropdown.workflow-button(
  @command="onCommand"
  :trigger="disabled ? undefined : trigger"
  v-if="step"
  :disabled="disabled"
)
  el-button(
    :type="step.type"
    :size="size"
    :disabled="disabled"
  ) {{ $t(step.label) }}
  template(#dropdown)
    el-dropdown-menu
      el-dropdown-item(
        v-for="option in options"
        :key="option.to"
        :command="option.to"
      ) {{ $t(option.label) }}

</template>
<script setup lang="ts">

import { watch } from 'vue'
import { useWorkflow, type WorkflowProps } from '@/services/workflowing';
import type { ElementTrigger } from '@/types/elements'

const props = withDefaults(defineProps<WorkflowProps & {
  trigger?: ElementTrigger
}>(), {
  trigger: 'click',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const { step, options, onCommand } = useWorkflow(props, emit);

watch(step, s => {
  console.log(s)
})

</script>
