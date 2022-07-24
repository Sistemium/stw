<template lang="pug">

.stock-taking-item-list.list-group(v-if="items.length")
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      article-view(:article-id="item.articleId")
      .cts {{ $ts(item.deviceCts || item.cts) }}
    .right
      .quantity {{ item.quantity }}
      span x
      .boxRel {{ item.boxRel }}
      span &equals;
      .units {{ item.units }}

</template>
<script>
import ArticleView from '@/components/catalogue/ArticleView.vue';

export default {
  name: 'StockTakingItemList',
  components: { ArticleView },
  props: {
    items: Array,
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.list-group-item {
  text-align: left;
  display: flex;
  justify-content: space-between;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  span {
    margin: 0 $padding;
  }
}

.cts {
  font-size: smaller;
  color: $gray;
}

</style>
