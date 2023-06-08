import type ApiModel from '@/models/ApiModels';

export default interface StockArticleDate extends ApiModel {
  articleId: string;
  storageId: string;
  date: string;
  nextDate: string;
  initUnits: number;
  resultUnits: number;
  initCost: number;
  cost: number;
  resultCost: number;
  unitsIn: number;
  unitsOut: number;
  unitsFix: number;
  unitsSur: number;
  operations: {
    operationId: string;
    operationType: 'in' | 'out' | 'fix';
    units: number;
    price: number;
    sign: number;
    result: number;
    timestamp: string;
    articleId: string;
  }[],
}
