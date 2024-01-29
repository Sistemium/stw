import Model from '@/init/Model';
import type { StockOperation } from '@/models/StockOperations'

export default new Model<StockOperation>({
  collection: 'StockReceiving',
  schema: {
    storageId: String,
  },
  methods: {},
});

export { workflow } from './StockWithdrawing';
