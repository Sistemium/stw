<template lang="pug">

.stock-operation-item-list.list-group
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
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
<script>
import ArticleView from '@/components/catalogue/ArticleView.vue';
import { shortenedPackage } from '@/models/PackageType';

export default {
  name: 'StockOperationItemList',
  props: {
    stockOperationId: String,
    items: Array,
    priceField: { type: String, default: 'price' },
  },
  components: { ArticleView },
  methods: {
    shortenedPackage,
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
