<template lang="pug">
el-form-item(prop="cost" :label="$t('fields.cost')")
  template(v-if="data")
    span {{ $n(cost, 'decimal') }}
    template(v-if="units > 1 && data.cost")
      small x
      span {{ units }}
      small &equals;
      span {{ $n(units * cost, 'decimal') }}

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

const cost = computed(() => {
  return data.value?.cost * (props.vatPrices ? (1 + props.vatRate) : 1);
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

small {
  padding: 0 3px;
}
</style>
