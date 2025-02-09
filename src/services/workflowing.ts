import { computed } from 'vue'
import type { ComputedRef, Ref} from 'vue'
import Workflow from '@/lib/Workflow'
import type { ElementsSize } from '@/types/elements'
import type { WorkflowStepOption } from '@/lib/WorkflowStep'
// import type WorkflowStep from '@/lib/WorkflowStep'

export function useWorkflow(props: WorkflowProps, emit: (e: 'update:modelValue', to: any) => void) {

  const step = computed(() => props.workflow.step(props.modelValue))
  const options: Ref<WorkflowStepOption[]> = computed(() => step.value?.options || [])

  return {
    step,
    options,
    onCommand(to: any): void {
      emit('update:modelValue', to)
    },
  }
}

export interface WorkflowProps {
  workflow: Workflow
  disabled?: boolean
  modelValue: string
  size?: ElementsSize
}

export const workflowProps = {
  workflow: Workflow,
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: String,
  size: {
    type: String,
    default: 'small',
  },
}

export function useOperationDisabled(operation: ComputedRef<{
  processing?: string
}>, workflow: Workflow) {
  const disabled = computed(() => {
    const { processing } = operation.value
    return !workflow.step(processing)?.editable
  })
  return {
    disabled,
  }
}
