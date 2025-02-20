import type ApiModel from '@/models/ApiModels'
import type { MaterialFields } from '@/models/Recipes'
import type { CounterPartyRef } from '@/services/warehousing'

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
  materials: MaterialFields[] | null;
  tare:  MaterialFields | null;
}

export interface CounterParty extends ApiModel {
  name: string;
}

export type CounterpartyType = 'Storage' | 'LegalEntity' | 'Person' | null;
export interface StockOperation extends CounterPartyRef {
  id?: string;
  date?: string | Date;
  ndoc?: string;
  storageId?: string | null;
  partnerId?: string;
  counterpartyType?: CounterpartyType;
  counterpartyId?: string | null;
  processing?: string;
  commentText?: string;
  deviceCts?: string;
  sourceId?: string;
  pricingId?: string
  markup?: number
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

export interface IStockReceivingItem extends StockOperationItem {
  stockReceivingId: string
}

export interface IStockTakingItem extends StockOperationItem {
  stockTakingId: string
}
