<template lang="pug">

v-virtual-scroll.stock-operation-list.list-group(
  ref="scrollRef"
  :items="viewData"
  :height="height"
)
  template(#default="{ item }")
    stock-operation-list-item(
      :id="`id-${item.id}`"
      @click="emit('click', item)"
      :class="{ active: activeId === item.id }"
      :view-data="item"
    )

</template>
<script setup lang="ts">

import { ref } from 'vue';
import StockOperationListItem from '@/components/out/StockOperationListItem.vue';
import type { StockOperationViewData } from '@/models/StockOperations';

const scrollRef = ref(null);

const props = defineProps<{
  viewData: StockOperationViewData[];
  activeId?: string;
  height: number;
}>();

defineExpose({
  scrollToId(id: string): boolean {
    const idx = props.viewData.findIndex(item => item.id === id);
    if (idx < 0 || !scrollRef.value) {
      return false;
    }
    setTimeout(() => {
      scrollRef.value.scrollToIndex(idx ? idx - 1 : 0);
    }, 100);
    return true;
  },
});

const emit = defineEmits<{
  (e: 'click', item: StockOperationViewData): void;
}>();

</script>
