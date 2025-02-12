<template lang="pug">

virtual-scroll-list.stock-operation-list.list-group(
  data-key="id"
  :data-sources="viewData"
  :data-component="StockOperationListItem"
  ref="scrollRef"
  :extra-props="{ activeId, onClick }"
)

</template>
<script setup lang="ts">

import { ref } from 'vue';
import VirtualScrollList from 'vue3-virtual-scroll-list';
import StockOperationListItem from '@/components/out/StockOperationListItem.vue';
import type { StockOperationViewData } from '@/models/StockOperations';

const scrollRef = ref();

const props = defineProps<{
  viewData: StockOperationViewData[];
  activeId?: string;
}>();

defineExpose({
  scrollToId(id: string): boolean {
    const idx = props.viewData.findIndex(item => item.id === id);
    if (idx < 0 || !scrollRef.value) {
      return false;
    }
    setTimeout(() => {
      scrollRef.value?.scrollToIndex(idx ? idx - 1 : 0);
    }, 100);
    return true;
  },
});

const emit = defineEmits<{
  (e: 'click', item: StockOperationViewData): void;
}>();

function onClick(item: StockOperationViewData) {
  emit('click', item);
}

</script>
