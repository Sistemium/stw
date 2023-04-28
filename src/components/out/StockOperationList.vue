<template lang="pug">

.stock-operation-list.list-group
  stock-operation-list-item(
    :id="`id-${item.id}`"
    v-for="item in viewData"
    :key="item.id"
    @click="emit('click', item)"
    :class="{ active: activeId === item.id }"
    :view-data="item"
  )

</template>
<script setup lang="ts">

import StockOperationListItem from '@/components/out/StockOperationListItem.vue';
import type { StockOperationViewData } from '@/models/StockOperations';

defineProps<{
    viewData: StockOperationViewData[];
    activeId?: string;
}>();

const emit = defineEmits<{
  (e: 'click', item: StockOperationViewData): void;
}>();

</script>
