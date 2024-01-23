import type ApiModel from '@/models/ApiModels';
import model from '@/models/ArticleProp';

export default interface ArticleProp extends ApiModel {
  name: string;
  type: string;
  isNaming: boolean;
  ord: number;
  isRequired: boolean;
}

export function filterArticleProps(filter: Record<string, any>) {
  return model.reactiveFilter(filter) as ArticleProp[];
}

export function getArticleProp(id : string) {
  return model.reactiveGet(id) as ArticleProp;
}
