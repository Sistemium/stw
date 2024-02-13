import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IArticlePricing extends ApiModel {
  pricingId: string
  articleId: string
  price: number
  date: string
  masterId?: string | null
  siteId?: string | null
}

export default new Model<IArticlePricing>({
  collection: 'ArticlePricing',
  schema: {
    pricingId: String
  },
  methods: {},
});
