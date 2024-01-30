import ArticlePricing from '@/models/ArticlePricing'
import { orderByDateDesc } from '@/services/util'


export function getPricing(pricingId: string, articleId: string, date: string, siteId?: string, masterId?: string) {
  const prices = ArticlePricing.reactiveManyByIndex('pricingId', pricingId)
    .filter(ap => {
      return ap.articleId === articleId
        && ap.date <= date
        && (!ap.siteId || ap.siteId === siteId)
        && (!ap.masterId || ap.masterId === masterId)
    })
  const hasMaster = !!masterId && !!prices.find(p => p.masterId)
  const matching = orderByDateDesc(prices)
    .find(p => !hasMaster || p.masterId)
  return matching?.price || 0
}
