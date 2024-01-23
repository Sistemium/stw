import type ApiModel from '@/models/ApiModels';
import model from '@/models/ArticleProp';

export default interface ArticleProp extends ApiModel {
  name: string;
  type: string;
  isNaming: boolean;
  ord: number;
  isRequired: boolean;
}

export function filterArticleProps(filter: Record<string, any>) : ArticleProp[] {
  return model.reactiveFilter(filter);
}

export function getArticleProp(id : string) : ArticleProp {
  return model.reactiveGet(id);
}
