import Model from '@/init/Model';
import type { IArticle } from '@/models/Articles'

export default new Model<IArticle>({
  collection: 'Article',
  schema: {},
  methods: {},
});
