<template lang="pug">

.stock-operation-list-item.list-group-item(@click="emit('click')")
  .title
    .date {{ $ts(viewData.date, 'short') }}
    .counterparty(v-if="viewData.counterpartyName") {{ viewData.counterpartyName }}
    .comment-text(v-if="viewData.commentText") {{ viewData.commentText }}
  .right
    .processing {{ viewData.processing }}
    .positions(
      v-if="viewData.positionsCount"
    ) {{ viewData.positionsCount }} {{ $t('shortened.positions') }}.
    //.products(
    //  v-if="viewData.productsCount"
    //) {{ viewData.productsCount }} {{ $t('shortened.products') }}.
    .total-cost(v-if="viewData.totalCost") {{ viewData.totalCost }} &euro;

</template>
<script setup lang="ts">

import type { StockOperationViewData } from '@/models/StockOperations';

defineProps<{
  viewData: StockOperationViewData;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";

.comment-text {
  color: $gray;
  font-size: smaller;
}
</style>
