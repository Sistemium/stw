import Model from '@/init/Model';
import Workflow from '@/lib/Workflow'
import type ApiModel from '@/models/ApiModels'

export interface IServiceTask extends ApiModel {
  date: Date
  description: string
}

export default new Model<IServiceTask>({
  collection: 'ServiceTask',
  schema: {},
  methods: {},
});


export const serviceTaskWorkflow = new Workflow({
  default: 'draft',
  options: [
    {
      processing: 'draft',
      label: 'workflow.draft',
      options: [{
        to: 'assigned',
        label: 'workflow.assign',
        type: 'primary',
      }],
      primaryOption: 'assigned',
      editable: true,
    },
    {
      processing: 'assigned',
      label: 'workflow.assigned',
      options: [{
        to: 'draft',
        label: 'workflow.unassign',
        // type: 'primary',
      }],
      // primaryOption: 'assigned',
      editable: false,
    },
  ],
})
