<template lang="pug">

.stock-withdrawing-item-list.list-group
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      article-view(:article-id="item.articleId")
    .right
      .volume
        template(v-if="item.boxRel > 1")
          span.quantity {{ item.quantity }} {{ $t('shortened.boxes') }}
          template(v-if="item.quantity > 1")
            span x
            span.boxRel {{ item.boxRel }}
          span &equals;
        span.units {{ item.units }} {{ $t('shortened.units') }}
      .cost(v-if="item.price")
        .price {{ item.price }} &euro;

</template>
<script>
import ArticleView from '@/components/catalogue/ArticleView.vue';

export default {
  name: 'StockWithdrawingItemList',
  props: {
    stockWithdrawingId: String,
    items: Array,
  },
  components: { ArticleView },
};

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
