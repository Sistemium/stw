<template lang="pug">

.stock-withdrawing-list-item.list-group-item(@click="$emit('click')")
  .title
    .date {{ $ts(stockWithdrawing.date, 'short') }}
    .consignee(v-if="consignee") {{ consignee.name }}
    //.storage {{ storage }}
  .right
    workflow-processing(:processing="stockWithdrawing.processing")
    .positions {{ positions.length }} {{ $t('shortened.positions') }}.

</template>
<script>

import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import Storage from '@/models/Storage';
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue';
import { getConsignee } from '@/services/warehousing';

export default {
  name: 'StockWithdrawingListItem',
  components: { WorkflowProcessing },
  props: {
    stockWithdrawing: Object,
  },
  computed: {
    positions() {
      const { id: stockWithdrawingId } = this.stockWithdrawing;
      return StockWithdrawingItem.reactiveFilter({ stockWithdrawingId });
    },
    storage() {
      const { name } = Storage.reactiveGet(this.stockWithdrawing.storageId) || {};
      return name;
    },
    consignee() {
      return getConsignee(this.stockWithdrawing || {});
    },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
