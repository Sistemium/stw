import Workflow from '@/lib/Workflow'
import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'
// import HydratedModel from '@/lib/HydratedModel'
// import type { IEmployee } from '@/models/Employee'

export interface IServiceTask extends ApiModel {
  date: string
  description: string
  siteId: string
  assigneeId?: string
}

// export interface HydratedServiceTask extends IServiceTask {
//   assignee?: IEmployee
// }

export default new Model<IServiceTask>({
  collection: 'ServiceTask',
  schema: {},
  // methods: {},
  relations: {
    // assignee: 'Employee',
  }
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
