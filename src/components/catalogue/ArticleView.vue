<template lang="pug">

.article-view(v-if="article")
  .name {{ article.name }}

</template>
<script>
import Article from '@/models/Article';

export default {
  name: 'ArticleView',
  props: {
    articleId: {
      type: String,
    },
  },
  computed: {
    article() {
      return Article.reactiveGet(this.articleId);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
