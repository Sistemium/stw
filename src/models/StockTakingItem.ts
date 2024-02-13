import Model from '@/init/Model';
import type { IStockTakingItem } from '@/models/StockOperations'

export default new Model<IStockTakingItem>({
  collection: 'StockTakingItem',
  schema: {
    stockTakingId: String,
  },
  methods: {},
});
