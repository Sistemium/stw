<template lang="pug">

.stock-taking-list.list-group
  stock-taking-list-item-view(
    v-for="item in items" :key="item.id"
    :stock-taking-item="item"
    @click="$emit('click', item)"
    @positionsClick="$emit('positionsClick', item)"
  )

</template>
<script>

import StockTakingListItemView from '@/components/stock/StockTakingListItemView.vue';

export default {
  name: 'StockTakingList',
  components: { StockTakingListItemView },
  props: {
    items: Array,
  },
  methods: {},
};

</script>
<style scoped lang="scss">

</style>
