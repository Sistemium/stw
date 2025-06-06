<template lang="pug">
el-form-item.article-cost-info(:label="label")
  span {{ cost }} &euro;
  template(v-if="units > 1 && cost")
    small x
    span {{ units }}
    small &equals;
    span {{ $nr(units * cost) }}

</template>

<script setup lang="ts">

import { computed, watch } from 'vue';
import round from 'lodash/round';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import type { CostType, MaterialFields } from '@/models/Recipes';
import StockArticleDate from '@/models/StockArticleDate.js'
import { t } from '@/lib/validations';
import { stockArticleDateReactive } from '@/services/warehousing'
import Article from '@/models/Article'

const props = defineProps<{
  storageId: string;
  articleId: string;
  date: string;
  vatRate?: number;
  vatPrices: boolean;
  units?: number;
  materials?: MaterialFields[];
  type?: CostType;
  labelSuffix?: string;
  customLabel?: string
}>();

const label = computed(() => props.customLabel || [
  t('fields.cost'),
  props.labelSuffix,
  props.vatPrices && t('after.withVat'),
].filter(x => x).join(' '));

const data = computed<{ initCost: number, resultCost?: number, cost?: number }>(() => {
  if (!props.materials?.length) {
    return stockArticleDateReactive(props.storageId, props.articleId, props.date);
  }
  const materials: { articleId: string, units?: number }[] = [...props.materials]
  if (Article.reactiveGet(props.articleId)?.isSKU) {
    materials.push({ articleId: props.articleId, units: props.units })
  }
  const type = props.type || 'initCost';
  return {
    [type]: sumBy(materials, ({ articleId, units }) => {
      const initCostObj = stockArticleDateReactive(props.storageId, articleId, props.date) || {};
      const initCost = round(initCostObj[type] * (props.vatPrices ? (1 + (props.vatRate || 0)) : 1), 2);
      return initCost && units ? units * initCost : 0;
    }),
  } as Record<CostType, number>
});

const cost = computed(() => {
  const { value } = data;
  if (!value) {
    return 0;
  }
  const price = props.type ? value[props.type] : (value.initCost || value.resultCost);
  if (!price) {
    return 0
  }
  return round(price, 2) || 0;
});

const materialArticleIds = computed<string[]>(() => {
  const { materials } = props;
  if (!materials) {
    return [];
  }
  return filter(uniq(materials.map(({ articleId }) => articleId)));
});

const findSensor = computed(() => [
  ...materialArticleIds.value,
  props.date,
  props.storageId,
].join('|'));

const emit = defineEmits<{
  (e: 'updateValue', cost: number): void
}>()

watch(cost, c => {
  emit('updateValue', c)
}, { immediate: true })

watch(findSensor, async () => {
  const { value: articleIds } = materialArticleIds;
  if (!articleIds.length) {
    return;
  }
  await StockArticleDate.find({
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
  await StockArticleDate.find({
    storageId,
    articleId,
    date: { $lte: date },
    nextDate: { $gt: date },
  });
}, { immediate: true });


</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

small {
  padding: 0 3px;
}
</style>
