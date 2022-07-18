<template lang="pug">

.stock-taking-list-item-view.list-group-item(@click="$emit('click')")
  .title
    .date {{ $d(date) }}
    .storage {{ storage }}
  .right
    workflow-processing(:processing="stockTakingItem.processing")
    .positions {{ positions.length }} {{ $t('shortened.positions') }}.

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
    date() {
      return new Date(this.stockTakingItem.date);
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

</style>
