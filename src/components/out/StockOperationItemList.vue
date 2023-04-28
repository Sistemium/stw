<template lang="pug">

.stock-operation-item-list.list-group
  .list-group-item(
    v-for="item in items"
    :key="item.id"
    @click="emit('click', item)"
  )
    .title
      article-view(:article-id="item.articleId")
    .right
      .volume
        template(v-if="item.packages")
          span {{ item.packages }} {{ shortenedPackage(item.packageTypeId) }}
          template(v-if="item.packages > 1")
            span x
            span {{ item.unitsInPackage }}
          template(v-if="item.units > item.packages * item.unitsInPackage")
            span +
            span {{ item.units - item.packages * item.unitsInPackage }}
            span {{ $t(`units.short.${item.measureUnitId}`) }}
          span &equals;
        span {{ item.units }} {{ $t(`units.short.${item.measureUnitId}`) }}
      .cost(v-if="item.price")
        .price {{ item[priceField] }} &euro;

</template>
<script setup lang="ts">
import ArticleView from '@/components/catalogue/ArticleView.vue';
import { shortenedPackage } from '@/models/PackageType.js';
import type { StockOperationItem } from '@/models/StockOperations';

withDefaults(defineProps<{
  items: StockOperationItem[];
  priceField?: string;
}>(), { priceField: 'price' });

const emit = defineEmits<{
  (e: 'click', item: StockOperationItem);
}>();

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
