import { getCounterparty } from '@/services/warehousing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import sumBy from 'lodash/sumBy';

export default {
  methods: {
    itemToData(item) {
      const counterparty = getCounterparty(item);
      const positions = StockWithdrawingItem.reactiveFilter({ stockWithdrawingId: item.id });
      const totalCost = sumBy(positions, p => (p.price || 0) * (p.units || 0));
      return {
        ...item,
        processing: this.$t(`workflow.${item.processing || 'progress'}`),
        date: this.$ts(item.date, 'short'),
        counterparty,
        counterpartyName: this.$get(counterparty, 'name'),
        positionsCount: positions.length,
        units: sumBy(positions, 'units'),
        totalCost: totalCost ? this.$n(totalCost) : null,
      };
    },
  },
};
