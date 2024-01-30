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


export function useSetPrices(props: { model: BaseItem }) {

  return {
    setOtherPrice(vatPrices: boolean, vatRate: number, price: number | null | undefined) {
      const otherField = vatPrices ? 'price' : 'vatPrice'
      const fn = vatPrices ? (v: number = 0) => v / (1.0 + vatRate) : (v: number = 0) => v * (1.0 + vatRate)
      props.model[otherField] = price ? round(fn(price), 2) : null
    },
  }

}
