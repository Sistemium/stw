<template lang="pug">

.workflow-transitions
  el-button(
    v-for="option in options"
    :disabled="disabled"
    :key="option.processing"
    :size="size"
    :type="option.type"
    @click="onCommand(option.to)"
  ) {{ $t(option.label) }}

</template>
<script setup lang="ts">

import { useWorkflow, workflowProps } from '@/services/workflowing';

const props = defineProps({
  ...workflowProps,
  workflow: Object,
  value: String,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const { options, onCommand } = useWorkflow(props, emit);

</script>
