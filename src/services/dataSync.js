import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';

// eslint-disable-next-line import/prefer-default-export
export async function initData() {
  await ArticleProp.findAll();
  await PropOption.findAll();
}
