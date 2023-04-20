<template lang="pug">

.stock-taking-list.list-group
  stock-taking-list-item(
    :id="`id-${item.id}`"
    v-for="item in items" :key="item.id"
    :stock-taking="item"
    :class="{ active: activeId === item.id }"
    @click="$emit('click', item)"
    @positions-click="$emit('positionsClick', item)"
  )

</template>
<script>

import StockTakingListItem from '@/components/stock/StockTakingListItem.vue';

export default {
  name: 'StockTakingList',
  components: { StockTakingListItem },
  props: {
    items: Array,
    activeId: String,
  },
  methods: {},
};

</script>
<style scoped lang="scss">

</style>
