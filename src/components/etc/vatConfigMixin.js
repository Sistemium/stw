import { vatConfig } from '@/services/warehousing';

export default {
  computed: {
    vatConfig() {
      return vatConfig();
    },
    vatOperationConfig() {
      const { vatConfig: { rules }, operationName } = this;
      if (!operationName) {
        throw Error('No operationName');
      }
      const { vatPrices = {}, defaultRate: vatRate = 0 } = rules;
      return {
        vatRate,
        vatPrices: vatPrices[operationName] || false,
      };
    },
  },
};
