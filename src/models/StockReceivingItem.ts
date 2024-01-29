import Model from '@/init/Model';
import type { IStockReceivingItem } from '@/models/StockOperations'

export default new Model<IStockReceivingItem>({
  collection: 'StockReceivingItem',
  schema: {
    stockReceivingId: String,
  },
  methods: {},
});
