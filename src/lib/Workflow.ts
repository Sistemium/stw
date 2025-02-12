import WorkflowStep, { type WorkflowOption } from '@/lib/WorkflowStep'


export default class {

  default?: string
  map: Map<string, WorkflowStep>
  options: WorkflowOption[]

  constructor(config: { default: string, options: WorkflowOption[] }) {
    const { options = [] } = config
    const mapping: [string, WorkflowStep][] = options.map(option => [option.processing, new WorkflowStep(option)])
    this.map = new Map(mapping)
    this.default = config.default
    this.options = options
  }

  step(processing?: string) {
    const key = processing || this.default
    return key ? this.map.get(key) : undefined
  }

  allActive(is: boolean = true) {
    return this.options
      .filter(o => !o.inactive === is)
      .map(o => o.processing)
  }

}
