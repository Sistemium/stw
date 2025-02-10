import type { ElementType } from '@/types/elements'

export default class WorkflowStep implements WorkflowOption {

  config: Record<string, any>
  options: WorkflowStepOption[] = []
  editable: boolean = false
  label: string
  processing: string
  type?: ElementType

  constructor(config: WorkflowOption) {
    this.config = config;
    Object.assign(this, config);
    this.label = config.label
    this.processing = config.processing
  }


}

export interface WorkflowOption {
  processing: string
  label: string
  type?: string
  primaryOption?: string
  editable?: boolean
  options: WorkflowStepOption[]
}


export interface WorkflowStepOption {
  to: string
  label: string
  type?: string
}
