import type { ElementEffect, ElementType } from '@/types/elements'

export default class WorkflowStep implements WorkflowOption {

  config: Record<string, any>
  options: WorkflowStepOption[] = []
  editable: boolean = false
  label: string
  processing: string
  type?: ElementType
  effect?: ElementEffect

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
  type?: ElementType
  effect?: ElementEffect
  primaryOption?: string
  editable?: boolean
  options: WorkflowStepOption[]
  inactive?: boolean
}


export interface WorkflowStepOption {
  to: string
  label: string
  type?: string
}
