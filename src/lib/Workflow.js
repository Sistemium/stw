import WorkflowStep from '@/lib/WorkflowStep';

export default class {

  constructor(config = {}) {
    const { options = [] } = config;
    const mapping = options.map(option => [option.processing, new WorkflowStep(option)]);
    this.map = new Map(mapping);
    this.default = config.default;
  }

  step(processing) {
    return this.map.get(processing || this.default);
  }

}
