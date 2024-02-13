import Model from '@/init/Model';
import type ApiModel from '@/models/ApiModels'

export interface IStockPeriod extends ApiModel {
  articleId: string
  initUnits: number
  unitsIn: number
  unitsOut: number
  unitsSur: number
  resultUnits: number
  resultCost: number
}

export default new Model<IStockPeriod>({
  collection: 'StockPeriod',
  schema: {},
  methods: {},
});
