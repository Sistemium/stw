import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IServicePointCustomer extends ApiModel {
  siteId: string
  counterpartyType: string
  name: string
  address: string
}

export default new Model<IServicePointCustomer>({
  collection: 'ServicePointCustomer',
  schema: {},
  relations: {},
})
