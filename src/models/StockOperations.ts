import type ApiModel from '@/models/ApiModels';
import type { MaterialFields } from '@/models/Recipes';

export interface ArticleQuantityFields {
  articleId: string;

  packages: number;
  packageTypeId: string;
  unitsInPackage: number;

  measureId: string;
  measureUnitId: string;
  units: number;

  barcode?: string;
}

export interface StockOperationItem extends ArticleQuantityFields {
  price?: number;
  vatRate?: number;
  vatPrice?: number;
  materials: MaterialFields[];
}

export interface CounterParty extends ApiModel {
  name: string;
}

export interface StockOperation {
  date: string | Date;
  storageId?: string;
  partnerId?: string;
  counterpartyType?: 'Storage' | 'LegalEntity' | 'Person' | null;
  counterpartyId?: string;
  processing: string;
  commentText?: string;
  deviceCts?: string;
}

export interface StockOperationViewData extends  StockOperation {
  processing: string;
  counterparty: CounterParty;
  counterpartyName: string;
  positionsCount: number;
  units: number;
  totalCost: number;
}
