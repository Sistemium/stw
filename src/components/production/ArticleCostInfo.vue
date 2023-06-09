<template lang="pug">
el-form-item(:label="$t('fields.cost')")
  span {{ $n(cost, 'decimal') }}
  template(v-if="units > 1 && cost")
    small x
    span {{ units }}
    small &equals;
    span {{ $n(units * cost, 'decimal') }}

</template>

<script setup lang="ts">

import { computed, watch } from 'vue';
import model from '@/models/StockArticleDate.js';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import type StockArticleDate from '@/models/StockArticleDates';
import type { MaterialFields } from '@/models/Recipes';

const props = defineProps<{
  storageId: string;
  articleId: string;
  date: string;
  vatRate: number;
  vatPrices: boolean;
  units?: number;
  materials?: MaterialFields[];
  type?: 'initCost' | 'resultCost' | 'cost';
}>();

const data = computed<{ initCost: number, resultCost?: number }>(() => {
  if (!props.materials) {
    return stockArticleDateReactive(props.storageId, props.articleId, props.date);
  }
  return {
    initCost: sumBy(props.materials, ({ articleId, units }) => {
      const initCost = stockArticleDateReactive(props.storageId, articleId, props.date)?.initCost;
      return initCost && units ? units * initCost : 0;
    }),
  };
});

const cost = computed(() => {
  const { value } = data;
  if (!value) {
    return 0;
  }
  const price = props.type ? value[props.type] : (value.initCost || value.resultCost);
  return price * (props.vatPrices ? (1 + props.vatRate) : 1) || 0;
});

watch(() => props.materials, async materials => {
  if (!materials) {
    return;
  }
  const articleIds = filter(uniq(materials.map(({ articleId }) => articleId)));
  if (!articleIds.length) {
    return;
  }
  await model.find({
    storageId: props.storageId,
    articleId: { $in: articleIds },
    date: { $lte: props.date },
    nextDate: { $gt: props.date },
  });
}, { immediate: true });

watch(() => [props.articleId, props.storageId, props.date].join('|'), async () => {
  const {
    storageId,
    articleId,
    date,
    materials,
  } = props;
  if (materials || !storageId || !articleId || !date) {
    return;
  }
  await model.find({
    storageId,
    articleId,
    date: { $lte: date },
    nextDate: { $gt: date },
  });
}, { immediate: true });

function stockArticleDateReactive(storageId, articleId, date) {
  const many = model.reactiveManyByIndex('articleId', articleId) as StockArticleDate[];
  return many.filter(stock => {
    return stock.storageId === storageId
      && stock.date <= date
      && stock.nextDate >= date;
  })[0];
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

small {
  padding: 0 3px;
}
</style>
