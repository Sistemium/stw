<template lang="pug">

.stock-taking-item-list.list-group
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    article-view(:article-id="item.articleId")
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
}

.info {
  display: flex;
  justify-content: end;
  span {
    margin: 0 $padding;
  }
}

.units {
  //min-width: 20px;
  //text-align: right;
}

</style>
