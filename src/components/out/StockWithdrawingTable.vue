<template lang="pug">

el-table.stock-withdrawing-table(:data="data" @row-click="row => $emit('click', row)")
  el-table-column(
    prop="processing"
    :label="$t('fields.processing')"
    width="120"
  )
  el-table-column(
    prop="date"
    :label="$t('fields.date')"
    width="110"
  )
  el-table-column(
    prop="consigneeName"
    :label="$t('fields.consignee')"
  )
  el-table-column(
    prop="positionsCount"
    :label="$t('concepts.items')"
    width="100"
  )

</template>
<script>
import stockWithdrawingMixin from '@/components/stock/stockWithdrawingMixin';

export default {
  name: 'StockWithdrawingTable',
  props: {
    items: Array,
    activeId: String,
  },
  mixins: [stockWithdrawingMixin],
  computed: {
    data() {
      return this.$map(this.items, this.itemToData);
    },
    columnSize() {
      return this.size === 'small' ? 120 : 140;
    },
  },
};

</script>
<style scoped lang="scss">

</style>
