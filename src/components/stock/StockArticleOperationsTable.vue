<template lang="pug">

el-table.stock-article-operations-table(:data="operations")
  el-table-column(
    :label="$t('fields.date')"
  )
    template(v-slot="{ row }")
      span {{ $ts(row.date, 'short') }}
  el-table-column(
    prop="units"
    :label="$t('fields.units')"
    :width="columnWidth"
  )
  el-table-column(
    v-if="counterparty"
    :label="$t(counterparty)"
  )
    template(v-slot="{ row }")
      span(v-if="row.counterParty" ) {{ row.counterParty.name }}

</template>
<script>
export default {
  name: 'StockArticleOperationsTable',
  props: {
    operations: Array,
    counterparty: String,
    columnWidth: {
      type: Number,
      default: 120,
    },
  },
};

</script>
<style scoped lang="scss">

</style>
