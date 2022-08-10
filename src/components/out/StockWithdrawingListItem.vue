<template lang="pug">

.stock-withdrawing-list-item.list-group-item(@click="$emit('click')")
  .title
    .date {{ $ts(viewData.date, 'short') }}
    .counterparty(v-if="viewData.counterpartyName") {{ viewData.counterpartyName }}
    //.storage {{ storage }}
  .right
    .processing {{ viewData.processing }}
    .positions {{ viewData.positionsCount }} {{ $t('shortened.positions') }}.
    .total-cost(v-if="viewData.totalCost") {{ viewData.totalCost }} &euro;

</template>
<script>

export default {
  name: 'StockWithdrawingListItem',
  props: {
    viewData: { type: Object, required: true },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
