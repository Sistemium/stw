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
import { getConsignee } from '@/services/warehousing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';

export default {
  name: 'StockWithdrawingTable',
  props: {
    items: Array,
    activeId: String,
  },
  computed: {
    data() {
      return this.$map(this.items, this.itemToData);
    },
  },
  methods: {
    itemToData(item) {
      const consignee = getConsignee(item);
      const positions = StockWithdrawingItem.reactiveFilter({ stockWithdrawingId: item.id });
      return {
        ...item,
        processing: this.$t(`workflow.${item.processing || 'progress'}`),
        date: this.$ts(item.date, 'short'),
        consignee,
        consigneeName: this.$get(consignee, 'name'),
        positionsCount: positions.length,
      };
    },
  },
};

</script>
<style scoped lang="scss">

</style>
