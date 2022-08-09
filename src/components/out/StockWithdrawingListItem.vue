<template lang="pug">

.stock-withdrawing-list-item.list-group-item(@click="$emit('click')")
  .title
    .date {{ viewData.date }}
    .counterparty(v-if="viewData.counterpartyName") {{ viewData.counterpartyName }}
    //.storage {{ storage }}
  .right
    .processing {{ viewData.processing }}
    .positions {{ viewData.positionsCount }} {{ $t('shortened.positions') }}.
    .total-cost(v-if="viewData.totalCost") {{ viewData.totalCost }} &euro;

</template>
<script>

import stockWithdrawingMixin from '@/components/out/stockWithdrawingMixin';

export default {
  name: 'StockWithdrawingListItem',
  mixins: [stockWithdrawingMixin],
  props: {
    stockWithdrawing: Object,
  },
  computed: {
    viewData() {
      return this.itemToData(this.stockWithdrawing);
    },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
