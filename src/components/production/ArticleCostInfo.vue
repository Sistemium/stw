<template lang="pug">
el-form-item.article-cost-info(:label="label")
  span {{ $nr(cost) }} &euro;
  template(v-if="units > 1 && cost")
    small x
    span {{ units }}
    small &equals;
    span {{ $n(units * cost, 'decimal') }}

</template>

<script setup lang="ts">

import { computed, watch } from 'vue';
import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import sumBy from 'lodash/sumBy';
import type { CostType, MaterialFields } from '@/models/Recipes';
import StockArticleDate from '@/models/StockArticleDate.js'
import { t } from '@/lib/validations';
import { stockArticleDateReactive } from '@/services/warehousing'

const props = defineProps<{
  storageId: string;
  articleId: string;
  date: string;
  vatRate: number;
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
  if (!props.materials) {
    return stockArticleDateReactive(props.storageId, props.articleId, props.date);
  }
  const type = props.type || 'initCost';
  return {
    [type]: sumBy(props.materials, ({ articleId, units }) => {
      const initCostObj = stockArticleDateReactive(props.storageId, articleId, props.date) || {};
      const initCost = initCostObj[type];
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
  return price * (props.vatPrices ? (1 + props.vatRate) : 1) || 0;
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
