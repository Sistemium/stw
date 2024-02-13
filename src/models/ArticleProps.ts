import type ApiModel from '@/models/ApiModels';
import model from '@/models/ArticleProp';

export type PropDataType = 'boolean' | 'string' | 'options' | 'number'

export interface IArticleProp extends ApiModel {
  name: string;
  type: PropDataType;
  isNaming: boolean;
  ord: number;
  isRequired: boolean;
}

export function filterArticleProps(filter: Record<string, any>) {
  return model.reactiveFilter(filter) as IArticleProp[];
}

export function getArticleProp(id : string) {
  return model.reactiveGet(id) as IArticleProp;
}
