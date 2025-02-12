import Workflow from '@/lib/Workflow'
import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IServiceTask extends ApiModel {
  date: string
  description: string
  siteId: string
  assigneeId?: string
  processing: string
  servicePointId: string
  counterpartyType: string
}


export default new Model<IServiceTask>({
  collection: 'ServiceTask',
  schema: {},
  // methods: {},
  relations: {
    // assignee: 'Employee',
  },
})


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
      // type: 'success',
    },
    {
      processing: 'rejected',
      label: 'workflow.rejected',
      options: [{
        to: 'assigned',
        label: 'workflow.assign',
        type: 'primary',
      }],
      primaryOption: 'assigned',
      editable: true,
      type: 'danger',
      effect: 'dark'
    },
    {
      processing: 'assigned',
      label: 'workflow.assigned',
      options: [{
        to: 'rejected',
        label: 'workflow.reject',
        type: 'warning',
      }, {
        to: 'accepted',
        label: 'workflow.accept',
        type: 'primary',
      }],
      primaryOption: 'finished',
      editable: true,
      type: 'primary',
    },
    {
      processing: 'accepted',
      label: 'workflow.accepted',
      options: [{
        to: 'rejected',
        label: 'workflow.reject',
        type: 'danger',
      }, {
        to: 'finished',
        label: 'workflow.finish',
        type: 'primary',
      }],
      primaryOption: 'finished',
      editable: true,
      type: 'primary',
    },
    {
      processing: 'finished',
      label: 'workflow.finished',
      options: [{
        to: 'assigned',
        label: 'workflow.unassign',
        // type: 'success',
      }],
      // primaryOption: 'assigned',
      type: 'success',
      editable: false,
      inactive: true,
    },
  ],
})
