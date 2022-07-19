<template lang="pug">

.stock-taking-list-item-view.list-group-item(@click="$emit('click')")
  .title
    .date {{ $ts(stockTakingItem.date, 'short') }}
    .storage {{ storage }}
  .right
    workflow-processing(:processing="stockTakingItem.processing")
    el-button.positions(
      type="text"
      @click.stop="$emit('positionsClick')"
    ) {{ positions.length }} {{ $t('shortened.positions') }}.

</template>
<script>

import StockTakingItem from '@/models/StockTakingItem';
import Storage from '@/models/Storage';
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue';

export default {
  name: 'StockTakingListItemView',
  components: { WorkflowProcessing },
  props: {
    stockTakingItem: Object,
  },
  computed: {
    positions() {
      const { id: stockTakingId } = this.stockTakingItem;
      return StockTakingItem.reactiveFilter({ stockTakingId });
    },
    storage() {
      const { name } = Storage.reactiveGet(this.stockTakingItem.storageId) || {};
      return name;
    },
  },
};

</script>
<style scoped lang="scss">

.list-group-item {
  display: flex;
  justify-content: space-between;
}
.el-button.positions {
  padding: 0;
}
</style>
