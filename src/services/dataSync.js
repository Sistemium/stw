import ArticleProp from '@/models/ArticleProp';

// eslint-disable-next-line import/prefer-default-export
export async function initData() {
  await ArticleProp.findAll();
}
