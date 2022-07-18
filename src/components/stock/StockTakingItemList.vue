<template lang="pug">

.stock-taking-item-list.list-group(v-if="items.length")
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      article-view(:article-id="item.articleId")
      .cts {{ $ts(item.deviceCts || item.cts) }}
    .info
      .boxRel {{ item.quantity }}
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

.info {
  display: flex;
  justify-content: end;
  span {
    margin: 0 $padding;
  }
}

.cts {
  font-size: smaller;
  color: $gray;
}

</style>
