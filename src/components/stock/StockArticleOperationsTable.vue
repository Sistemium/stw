<template lang="pug">

el-table.stock-article-operations-table(
  :data="operations"
  @row-click="(row, column) => emit('rowClick', row, column)"
)
  el-table-column(
    :label="$t('fields.date')"
    :width="columnWidth"
  )
    template(#default="{ row }")
      span {{ $ts(row.date, 'short') }}
  el-table-column(
    prop="units"
    align="right"
    :label="$t('fields.units')"
    :width="columnWidth"
  )
  el-table-column(
    prop="price"
    align="right"
    :label="$t('fields.price')"
    :width="columnWidth"
  )
  el-table-column(
    prop="vatPrice"
    align="right"
    :label="$t('fields.vatPrice')"
    :width="columnWidth"
  )
  el-table-column(
    v-if="counterparty"
    :label="$t(counterparty)"
  )
    template(#default="{ row }")
      .name(v-if="row.counterParty") {{ row.counterParty.name }}
      .comment-text(v-if="row.commentText" ) {{ row.commentText }}

</template>
<script setup>

defineProps({
  operations: Array,
  counterparty: String,
  columnWidth: {
    type: Number,
    default: 120,
  },
});

const emit = defineEmits(['rowClick']);

</script>
<style scoped lang="scss">
.el-table :deep(td) {
  cursor: pointer;
}
</style>
