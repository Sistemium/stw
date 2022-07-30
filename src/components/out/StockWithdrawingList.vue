<template lang="pug">

.stock-withdrawing-list.list-group
  stock-withdrawing-list-item(
    v-for="item in items"
    :key="item.id"
    :stock-withdrawing="item"
    @click="$emit('click', item)"
    :class="{ active: activeId === item.id }"
  )

</template>
<script>

import StockWithdrawingListItem from '@/components/out/StockWithdrawingListItem.vue';

export default {
  name: 'StockWithdrawingList',
  components: { StockWithdrawingListItem },
  props: {
    items: Array,
    activeId: String,
  },
};

</script>
<style scoped lang="scss">

</style>
