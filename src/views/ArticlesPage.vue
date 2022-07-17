<template lang="pug">

.articles-page.page
  page-title(title="menu.articles")

  resize(:padding="20")
    article-list(:articles="articles" @click="onArticleClick")

  router-view

</template>
<script>

import ArticleList from '@/components/catalogue/ArticleList.vue';
import Article from '@/models/Article';
import orderBy from 'lodash/orderBy';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'ArticlesPage',
  props: {
    editRoute: String,
    createRoute: String,
  },
  components: { PageTitle, ArticleList },
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
@import "../styles/page";
</style>
