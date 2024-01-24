import type ApiModel from '@/models/ApiModels'
import type { MaterialFields } from '@/models/Recipes'

export interface ArticleQuantityFields {

  packages?: number;
  packageTypeId?: string;
  unitsInPackage?: number;

  articleId: string;
  measureId: string;
  measureUnitId: string;
  units: number;

  barcode?: string;
}

export interface StockOperationItem extends ArticleQuantityFields {
  stockWithdrawingId?: string;
  stockReceivingId?: string;
  stockTakingId?: string;
  price?: number;
  vatRate?: number;
  vatPrice?: number;
  materials: MaterialFields[];
}

export interface CounterParty extends ApiModel {
  name: string;
}

export type CounterpartyType = 'Storage' | 'LegalEntity' | 'Person' | null;
export interface StockOperation {
  id?: string;
  date?: string | Date;
  storageId?: string;
  partnerId?: string;
  counterpartyType?: CounterpartyType;
  counterpartyId?: string;
  processing?: string;
  commentText?: string;
  deviceCts?: string;
  sourceId?: string;
}

export interface StockOperationViewData extends  StockOperation {
  id: string;
  processing: string;
  counterparty: CounterParty;
  counterpartyName: string;
  positionsCount: number;
  units: number;
  totalCost: number;
}

export type StockOperationName = 'stockTaking' | 'stockWithdrawing' | 'stockReceiving'

export interface IStockWithdrawingItem extends StockOperationItem {
  stockWithdrawingId: string
}
