<template lang="pug">

el-table.stock-period-table(
  :data="data"
  @row-click="(row, column) => $emit('row-click', row, column)"
)
  el-table-column(
    :label="$t('concepts.article')"
  )
    template(v-slot="{ row }")
      article-view(:article-id="row.articleId")
  el-table-column(
    prop="initUnits"
    :label="$t('fields.initUnits')"
    :width="columnWidth"
  )
  el-table-column(
    prop="unitsIn"
    :label="$t('fields.unitsIn')"
    :width="columnWidth"
  )
  el-table-column(
    prop="unitsOut"
    :label="$t('fields.unitsOut')"
    :width="columnWidth"
  )
  el-table-column(
    prop="unitsSur"
    :label="$t('fields.unitsSur')"
    :width="columnWidth"
  )
  el-table-column(
    prop="resultUnits"
    :label="$t('fields.remains')"
    :width="columnWidth"
  )

</template>
<script>

import ArticleView from '@/components/catalogue/ArticleView.vue';

export default {
  name: 'StockPeriodTable',
  components: { ArticleView },
  props: {
    data: Array,
    columnWidth: {
      type: Number,
      default: 120,
    },
  },
};

</script>
<style scoped lang="scss">

.stock-period-table ::v-deep .cell {
  word-break: normal;
}

.el-table ::v-deep td {
  cursor: pointer;
}

</style>
