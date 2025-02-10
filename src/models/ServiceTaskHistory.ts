import Model from '@/init/Model'
import type ApiModel from '@/models/ApiModels'

export interface IServiceTaskHistory extends ApiModel {
  serviceTaskId: string
  type: 'create' | 'comment' | 'transition' | 'modify'
  authId: string
  timestamp: string
  processing?: string
  assigneeId?: string
  comment?: string
}

export default new Model<IServiceTaskHistory>({
  collection: 'ServiceTaskHistory',
  schema: {},
  relations: {},
})
