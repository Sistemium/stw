import { computed } from 'vue';
import { vatConfig as vatConfigFn } from '@/services/warehousing.js';

export function useVatConfig(operationName) {

  const vatConfig = computed(() => vatConfigFn());

  const vatOperationConfig = computed(() => {
    const { rules } = vatConfig.value;
    if (!operationName) {
      throw Error('No operationName');
    }
    const { vatPrices = {}, defaultRate: vatRate = 0 } = rules;
    return {
      vatRate,
      vatPrices: vatPrices[operationName] || false,
    };
  });

  return {
    vatConfig,
    vatOperationConfig,
  };

}
