<template lang="pug">

.article-props
  article-props-list(:article-props="articleProps")

</template>
<script>
import ArticleProp from '@/models/ArticleProp';
import ArticlePropsList from '@/components/catalogue/ArticlePropsList.vue';

export default {
  name: 'ArticleProps',
  components: { ArticlePropsList },
  computed: {
    articleProps() {
      return ArticleProp.reactiveFilter();
    },
  },
};

</script>
<style scoped lang="scss">

</style>
