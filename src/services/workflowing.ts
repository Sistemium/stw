import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { workflow } from '@/models/StockWithdrawing';

export function useWorkflow(props, emit) {

  const step = computed(() => props.workflow.step(props.modelValue));
  const options = computed(() => (step.value && step.value.options) || []);

  return {
    step,
    options,
    onCommand(to): void {
      emit('update:modelValue', to);
    },
  };
}

export const workflowProps = {
  workflow: Object,
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: String,
  size: {
    type: String,
    default: 'small',
  },
};

export function useOperationDisabled(operation: ComputedRef) {
  const disabled = computed(() => {
    const { processing } = operation.value;
    return !workflow.step(processing).editable;
  });
  return {
    disabled,
  };
}
