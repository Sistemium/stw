<template lang="pug">

.stock-operation-list-item.list-group-item(
  @click="onClick && onClick(source)"
  :class="{ active: activeId === source.id }"
)
  .title
    .date {{ $ts(source.date, 'short') }}
      span.ndoc(v-if="source.ndoc") &nbsp;{{$t('numberLabel')}} {{ source.ndoc }}
    .counterparty(v-if="source.counterpartyName") {{ source.counterpartyName }}
    .comment-text(v-if="source.commentText") {{ source.commentText }}
  .right
    .processing {{ source.processingLabel }}
    .positions(
      v-if="source.positionsCount"
    ) {{ source.positionsCount }} {{ $t('shortened.positions') }}.
    //.products(
    //  v-if="source.productsCount"
    //) {{ source.productsCount }} {{ $t('shortened.products') }}.
    .total-cost(v-if="source.totalCost") {{ $nr(source.totalCost) }} &euro;

</template>
<script setup lang="ts">

import type { StockOperationViewData } from '@/models/StockOperations';

defineProps<{
  source: StockOperationViewData;
  activeId?: string;
  onClick?: (item: StockOperationViewData) => void;
}>();

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";

.comment-text {
  color: $gray;
  font-size: smaller;
}
</style>
