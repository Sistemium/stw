import Model from '@/init/Model';

export default new Model({
  collection: 'StockReceiving',
  schema: {
    storageId: String,
  },
  methods: {},
});

export { workflow } from './StockWithdrawing';
