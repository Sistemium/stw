import Model from '@/init/Model';

export default new Model({
  collection: 'StockArticleDate',
  schema: {
    storageId: String,
    articleId: String,
  },
  methods: {},
});
