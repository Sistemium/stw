<template lang="pug">
span.article-stock-info
  span.stock(v-if="stock") {{ stock.resultUnits }} {{ $t(`units.short.${article?.measureUnitId || 'piece'}`) }}
</template>

<script setup lang="ts">

import { computed } from 'vue';
import orderBy from 'lodash/orderBy'
import model, { type IStockArticleDate } from '@/models/StockArticleDate'
import Article from '@/models/Article'

const props = defineProps<{
  storageId: string;
  articleId: string;
  measureUnitId?: string;
  date?: string;
  units?: number;
}>();

const stock = computed<IStockArticleDate | undefined>(() => {
  const [res] = orderBy(model.reactiveManyByIndex('articleId', props.articleId), ['date'], ['desc']);
  return res;
});

const article = computed(() => Article.reactiveGet(props.articleId))

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
