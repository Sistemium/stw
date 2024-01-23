export default class WorkflowStep implements Record<string, any> {

  config: Record<string, any>
  options: Record<string, any>[] = []
  editable: boolean = false

  constructor(config: Record<string, any>) {
    this.config = config;
    Object.assign(this, config);
  }

}
