export interface MaterialFields {
  id?: string;
  articleId: string;
  measureId: string;
  measureUnitId: string;
  units: number;
  price?: number;
  vatRate?: number;
  vatPrice?: number;
}

export interface RecipeMaterial extends MaterialFields {
  optionArticleIds?: string[];
}

export type CostType = 'initCost' | 'resultCost' | 'cost';
