<template lang="pug">
span.article-stock-info
  span.stock(v-if="stock") {{ stock.resultUnits }} {{ $t(`units.short.${measureUnitId}`) }}
</template>

<script setup lang="ts">

import { computed } from 'vue';
import orderBy from 'lodash/orderBy'
import model from '@/models/StockArticleDate';
import type StockArticleDate from '@/models/StockArticleDates';

const props = defineProps<{
  storageId: string;
  articleId: string;
  measureUnitId: string;
  date?: string;
  units?: number;
}>();

const stock = computed<StockArticleDate | undefined>(() => {
  const [res] = orderBy(model.reactiveManyByIndex('articleId', props.articleId), ['date'], ['desc']);
  return res;
});

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
