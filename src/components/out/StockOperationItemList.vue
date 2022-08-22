<template lang="pug">

.stock-operation-item-list.list-group
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      article-view(:article-id="item.articleId")
    .right
      .volume
        template(v-if="item.packages")
          span {{ item.packages }} {{ $t('shortened.boxes') }}
          template(v-if="item.packages > 1")
            span x
            span {{ item.unitsInPackage }}
          span &equals;
        span {{ item.units }} {{ $t('shortened.units') }}
      .cost(v-if="item.price")
        .price {{ item[priceField] }} &euro;

</template>
<script>
import ArticleView from '@/components/catalogue/ArticleView.vue';

export default {
  name: 'StockOperationItemList',
  props: {
    stockOperationId: String,
    items: Array,
    priceField: { type: String, default: 'price' },
  },
  components: { ArticleView },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
