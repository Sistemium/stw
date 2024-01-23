import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { vatConfig as vatConfigFn } from '@/services/warehousing.js';

interface VatOperationConfig {
  vatRate: number;
  vatPrices: boolean;
  priceField: string;
}

export interface VatConfig {
  rules: {
    vatPrices: {
      stockReceiving: boolean;
      stockWithdrawing: boolean;
    }
    defaultRate: number;
  },
}

export function useVatConfig(operationName: 'stockReceiving' | 'stockWithdrawing'): {
  vatConfig: ComputedRef<VatConfig>;
  vatOperationConfig: ComputedRef<VatOperationConfig>;
} {

  const vatConfig = computed<VatConfig>(() => vatConfigFn());

  const vatOperationConfig = computed<VatOperationConfig>(() => {
    const { rules } = vatConfig.value;
    if (!operationName) {
      throw Error('No operationName');
    }
    const { defaultRate: vatRate = 0 } = rules;
    const vatPrices = rules && rules.vatPrices[operationName] || false;
    return {
      vatRate,
      vatPrices,
      priceField: vatPrices ? 'vatPrice' : 'price',
    };
  });

  return {
    vatConfig,
    vatOperationConfig,
  };

}
