<template lang="pug">

.stock-withdrawing-list.list-group
  stock-withdrawing-list-item(
    v-for="item in viewData"
    :key="item.id"
    @click="$emit('click', item)"
    :class="{ active: activeId === item.id }"
    :view-data="item"
  )

</template>
<script>

import StockWithdrawingListItem from '@/components/out/StockWithdrawingListItem.vue';

export default {
  name: 'StockWithdrawingList',
  components: { StockWithdrawingListItem },
  props: {
    viewData: Array,
    activeId: String,
  },
};

</script>
<style scoped lang="scss">

</style>
