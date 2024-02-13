import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IPricing extends ApiModel {
  name: string
  vatPrices: boolean
  requireSite: boolean
}

export default new Model<IPricing>({
  collection: 'Pricing',
  schema: {},
  methods: {},
});
