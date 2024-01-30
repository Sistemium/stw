import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IPricing extends ApiModel {
  name: string
}

export default new Model<IPricing>({
  collection: 'Pricing',
  schema: {},
  methods: {},
});
