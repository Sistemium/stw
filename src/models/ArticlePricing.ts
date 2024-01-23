import type ApiModel from '@/models/ApiModels'
import Model from '@/init/Model'

export interface IArticlePricing extends ApiModel {
  articleId: string
  price: number
  date: Date
  masterId?: string
  siteId?: string
}

export default new Model({
  collection: 'ArticlePricing',
  schema: {},
  methods: {},
});
