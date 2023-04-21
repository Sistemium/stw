<template lang="pug">

.stock-taking-list.list-group
  stock-taking-list-item(
    :id="`id-${item.id}`"
    v-for="item in items" :key="item.id"
    :stock-taking="item"
    :class="{ active: activeId === item.id }"
    @click="emit('click', item)"
    @positions-click="emit('positionsClick', item)"
  )

</template>
<script setup>

import StockTakingListItem from '@/components/stock/StockTakingListItem.vue';

defineProps({
  items: Array,
  activeId: String,
});

const emit = defineEmits(['click', 'positionsClick']);

</script>
