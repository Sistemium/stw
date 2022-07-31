<template lang="pug">

.stock-withdrawing-item-list.list-group
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      article-view(:article-id="item.articleId")
      .cts {{ $ts(item.deviceCts || item.cts) }}
    .right
      template(v-if="item.boxRel > 1")
        .quantity {{ item.quantity }} {{ $t('shortened.boxes') }}
        template(v-if="item.quantity > 1")
          span x
          .boxRel {{ item.boxRel }}
        span &equals;
      .units {{ item.units }} {{ $t('shortened.units') }}

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
@import "../../styles/stockItemListItem";
</style>
