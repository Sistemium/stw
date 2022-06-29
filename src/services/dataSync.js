import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import Article from '@/models/Article';

// eslint-disable-next-line import/prefer-default-export
export async function initData() {
  await ArticleProp.findAll();
  await PropOption.findAll();
  await Article.findAll();
}
