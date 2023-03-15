<template lang="pug">

.stock-operation-list.list-group
  stock-operation-list-item(
    :id="`id-${item.id}`"
    v-for="item in viewData"
    :key="item.id"
    @click="$emit('click', item)"
    :class="{ active: activeId === item.id }"
    :view-data="item"
  )

</template>
<script>

import StockOperationListItem from '@/components/out/StockOperationListItem.vue';

export default {
  name: 'StockOperationList',
  components: { StockOperationListItem },
  props: {
    viewData: Array,
    activeId: String,
  },
};

</script>
<style scoped lang="scss">

</style>
