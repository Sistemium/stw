import Model from '@/init/Model'
import type ApiModel from '@/models/ApiModels'

export interface ILegalEntity extends ApiModel {
  name: string
  address: string
  code: string
  vatCode: string
}

export default new Model<ILegalEntity>({
  collection: 'LegalEntity',
  schema: {},
  methods: {},
})
