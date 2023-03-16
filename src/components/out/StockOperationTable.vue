<template lang="pug">

el-table.stock-operation-table(
  :data="viewData"
  @row-click="row => $emit('click', row)"
  :size="size"
  :height="height"
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
    :formatter="(r,c,date) => $ts(date, 'short')"
  )
  el-table-column(
    prop="counterpartyName"
    :label="counterpartyLabel"
  )
    template(v-slot="{ row }")
      .name(v-if="row.counterpartyName") {{ row.counterpartyName }}
      .comment(v-if="row.commentText") {{ row.commentText }}
  el-table-column(
    align="right"
    :label="$t('concepts.items')"
    width="100"
  )
    template(v-slot="{ row }")
      span(v-if="row.positionsCount") {{ row.positionsCount }}
      //span(v-if="row.productsCount && row.positionsCount") +
      //span(v-if="row.productsCount") {{ row.productsCount }}
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

export default {
  name: 'StockOperationTable',
  props: {
    viewData: Array,
    activeId: String,
    size: String,
    positionsModel: Object,
    height: Number,
    counterpartyRole: String,
  },
  computed: {
    counterpartyLabel() {
      return this.$t(`fields.${this.counterpartyRole}`);
    },
    // data() {
    //   return this.$map(this.items, this.itemToData);
    // },
    columnSize() {
      return this.size === 'small' ? 120 : 140;
    },
    // itemToData() {
    //   return item => stockOperationToViewData(item, this.positionsModel);
    // },
  },
};

</script>
<style scoped lang="scss">

</style>
