<template lang="pug">

.articles-page
  h1 {{ $t('menu.articles') }}

  resize(:padding="20")
    article-list(:articles="articles" @click="onArticleClick")

  router-view

</template>
<script>

import ArticleList from '@/components/catalogue/ArticleList.vue';
import Article from '@/models/Article';
import orderBy from 'lodash/orderBy';

export default {
  name: 'ArticlesPage',
  props: {
    editRoute: String,
    createRoute: String,
  },
  components: { ArticleList },
  computed: {
    articles() {
      return orderBy(Article.reactiveFilter(), 'name');
    },
  },
  methods: {
    onArticleClick(article) {
      this.$router.push({
        name: this.editRoute,
        params: {
          articleId: article.id,
        },
      });
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

.article-list {
  text-align: left;
  max-width: $max-width;
  margin: $margin-top auto 0;
}

@include responsive-only(xxs) {
  h1 {
    display: none;
  }
}

</style>
