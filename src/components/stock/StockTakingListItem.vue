<template lang="pug">

.stock-taking-list-item-view.list-group-item(@click="$emit('click')")
  .title
    .date {{ $ts(stockTaking.date, 'short') }}
    .storage {{ storage }}
  .right
    workflow-processing(:processing="stockTaking.processing")
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
  name: 'StockTakingListItem',
  components: { WorkflowProcessing },
  props: {
    stockTaking: Object,
  },
  computed: {
    positions() {
      const { id: stockTakingId } = this.stockTaking;
      return StockTakingItem.reactiveFilter({ stockTakingId });
    },
    storage() {
      const { name } = Storage.reactiveGet(this.stockTaking.storageId) || {};
      return name;
    },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
