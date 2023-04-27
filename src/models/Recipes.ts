export interface MaterialFields {
  id: string;
  articleId: string;
  measureId: string;
  measureUnitId: string;
  units: number;
}

export interface RecipeMaterial extends MaterialFields {
  optionArticleIds?: string[];
}
