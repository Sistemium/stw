<template lang="pug">

el-table.stock-withdrawing-table(
  :data="data"
  @row-click="row => $emit('click', row)"
  :size="size"
)
  el-table-column(
    prop="processing"
    :label="$t('fields.processing')"
    :width="columnSize"
  )
  el-table-column(
    prop="date"
    :label="$t('fields.date')"
    :width="columnSize"
  )
  el-table-column(
    prop="counterpartyName"
    :label="$t('fields.counterparty')"
  )
  el-table-column(
    align="right"
    prop="positionsCount"
    :label="$t('concepts.items')"
    width="100"
  )
  el-table-column(
    align="right"
    prop="units"
    :label="$t('fields.quantity')"
    width="120"
  )
  el-table-column(
    align="right"
    prop="totalCost"
    :label="$t('fields.totalCost')"
    width="120"
  )

</template>
<script>
import stockWithdrawingMixin from '@/components/out/stockWithdrawingMixin';

export default {
  name: 'StockWithdrawingTable',
  props: {
    items: Array,
    activeId: String,
    size: String,
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
