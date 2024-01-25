import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IArticlePricing extends ApiModel {
  pricingId: string
  articleId: string
  price: number
  date: Date
  masterId?: string
  siteId?: string
}

export default new Model<IArticlePricing>({
  collection: 'ArticlePricing',
  schema: {
    pricingId: String
  },
  methods: {},
});
