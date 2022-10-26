<template lang="pug">

.article-view(v-if="article")
  .name {{ article.name }}
  .code {{ article.code }}

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
@import "../../styles/variables";

.code {
  font-size: smaller;
  color: $gray;
}

.name, .code {
  line-height: 15px;
}

</style>
