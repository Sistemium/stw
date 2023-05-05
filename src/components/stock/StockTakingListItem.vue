<template lang="pug">

.stock-taking-list-item-view.list-group-item(@click="emit('click')")
  .title
    .date {{ $ts(stockTaking.date, 'short') }}
    .storage {{ storage }}
  .right
    workflow-processing(:processing="stockTaking.processing")
    el-link.positions(
      @click.stop="emit('positionsClick')"
    ) {{ positions.length }} {{ $t('shortened.positions') }}.

</template>
<script setup>

import { computed } from 'vue';
import StockTakingItem from '@/models/StockTakingItem';
import Storage from '@/models/Storage';
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue';

const props = defineProps({
  stockTaking: Object,
});

const emit = defineEmits(['positionsClick', 'click']);

const positions = computed(() => {
  const { id: stockTakingId } = props.stockTaking;
  return StockTakingItem.reactiveFilter({ stockTakingId });
});

const storage = computed(() => {
  const { name } = Storage.reactiveGet(props.stockTaking.storageId) || {};
  return name;
});

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
