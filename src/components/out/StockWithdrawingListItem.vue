<template lang="pug">

.stock-withdrawing-list-item.list-group-item(@click="$emit('click')")
  .title
    .date {{ $ts(stockWithdrawing.date, 'minutes') }}
    .storage {{ storage }}
  .right
    workflow-processing(:processing="stockWithdrawing.processing")
    el-button.positions(
      type="text"
      @click.stop="$emit('positionsClick')"
    ) {{ positions.length }} {{ $t('shortened.positions') }}.

</template>
<script>

import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import Storage from '@/models/Storage';
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue';

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
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
