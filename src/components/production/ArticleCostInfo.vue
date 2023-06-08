<template lang="pug">
el-row.article-cost-info
  el-col.lbl(:span="14") {{ $t('fields.cost') }}:
  el-col.val(:span="10" v-if="data")
    span {{ $n(data.cost, 'decimal') }}
    template(v-if="units > 1 && data.cost")
      small x
      span {{ units }}
      small &equals;
      span {{ $n(units * data.cost, 'decimal') }}

</template>

<script setup lang="ts">

import { computed, watch } from 'vue';
import model from '@/models/StockArticleDate.js';
import type StockArticleDate from '@/models/StockArticleDates';

const props = defineProps<{
  storageId: string;
  articleId: string;
  date: string;
  vatRate: number;
  vatPrices: boolean;
  units?: number;
}>();

const data = computed<StockArticleDate>(() => {
  const many = model.reactiveManyByIndex('articleId', props.articleId) as StockArticleDate[];
  return many.filter(stock => {
    return stock.storageId === props.storageId
      && stock.date <= props.date
      && stock.nextDate >= props.date;
  })[0];
});

watch(() => [props.articleId, props.storageId, props.date].join('|'), async () => {
  const {
    storageId,
    articleId,
    date,
  } = props;
  await model.find({
    storageId,
    articleId,
    date: { $lte: date },
    nextDate: { $gte: date },
  });
}, { immediate: true })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.el-row {
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
  margin-bottom: $margin-right;
}
.lbl, .val {
  text-align: right;
}
.el-col {
  padding: 0 $padding;
}
small {
  padding: 3px;
}
</style>
