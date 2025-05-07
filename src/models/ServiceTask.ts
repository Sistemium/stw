import Workflow from '@/lib/Workflow'
import type ApiModel from '@/models/ApiModels'
import { IUser } from '@/models/User'
import Model from '@/init/Model'
import { IEmployee } from '@/models/Employee'

// import { HydratedModel } from 'sistemium-data-vue'

export interface ServiceTaskService {
  articleId: string
  price: number
}

export interface IServiceTask extends ApiModel {
  date: string
  description: string
  siteId: string
  assigneeId?: string
  processing: string
  servicePointId: string
  counterpartyType: string
  creatorId?: string
  services: ServiceTaskService[]
}

export interface HydratedServiceTask extends IServiceTask {
  creator?: IUser
  assignee?: IEmployee
}

export default new Model<IServiceTask, HydratedServiceTask>({
  collection: 'ServiceTask',
  schema: {},
  // methods: {},
  relations: {
    creator: 'User',
    assignee: 'Employee',
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
      }, {
        to: 'cancelled',
        label: 'workflow.cancel',
        type: 'danger',
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
      }, {
        to: 'cancelled',
        label: 'workflow.cancel',
        type: 'danger',
      }],
      primaryOption: 'assigned',
      editable: true,
      type: 'danger',
      effect: 'dark',
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
      primaryOption: 'accepted',
      editable: false,
      type: 'danger',
      important: true,
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
      editable: false,
      type: 'warning',
      important: true,
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
    {
      processing: 'cancelled',
      label: 'workflow.cancelled',
      options: [
        {
          to: 'draft',
          label: 'workflow.makeDraft',
          type: 'primary',
        }
      ],
      // primaryOption: 'assigned',
      editable: false,
      // type: 'danger',
      effect: 'dark',
      inactive: true,
    },
  ],
})
