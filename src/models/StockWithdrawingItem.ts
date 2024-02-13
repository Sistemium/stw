import Model from '@/init/Model';
import type { IStockWithdrawingItem } from '@/models/StockOperations'

export default new Model<IStockWithdrawingItem>({
  collection: 'StockWithdrawingItem',
  schema: {
    stockWithdrawingId: String,
  },
  methods: {},
});
