import ApiModel from '@/models/ApiModels';
import model from '@/models/ArticleProp.js';

export default interface ArticleProp extends ApiModel {
  name: string;
  type: string;
  isNaming: boolean;
  ord: number;
  isRequired: boolean;
}

export function filterArticleProps(filter) : ArticleProp[] {
  return model.reactiveFilter(filter);
}

export function getArticleProp(id : string) : ArticleProp {
  return model.reactiveGet(id);
}
