<template lang="pug">

el-dropdown.workflow-button(
  @command="onCommand"
  :trigger="trigger"
  v-if="step"
)
  el-button(
    :type="step.style"
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

import { useWorkflow, workflowProps } from '@/services/workflowing';

const props = defineProps({
  ...workflowProps,
  trigger: {
    type: String,
    default: 'click',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const { step, options, onCommand } = useWorkflow(props, emit);

</script>
