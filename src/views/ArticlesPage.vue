<template lang="pug">

.articles-page
  h1 Articles

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

.article-list {
  text-align: left;
}

</style>
