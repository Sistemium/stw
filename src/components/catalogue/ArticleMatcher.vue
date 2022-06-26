<template lang="pug">

.article-matcher

  property-matcher(:title="title" v-model="filters")

  .name
    label Name:
    strong {{ this.compoundName }}

  .articles(v-if="filteredArticles.length")
    .article(v-for="article in filteredArticles" :key="article.id")

</template>
<script>
import PropertyMatcher from '@/components/props/PropertyMatcher.vue';
import Article from '@/models/Article';

export default {
  name: 'ArticleMatcher',
  props: {
    title: String,
  },
  computed: {
    filteredArticles() {
      return Article.reactiveFilter(this.arrayToFilters());
    },
    compoundName() {
      return this.filters
        && this.filters.map(filter => {
          const { stringValue, numberValue } = filter;
          const simple = stringValue || numberValue;
          if (simple) {
            return simple;
          }
          const { boolValue } = filter;
          if (boolValue !== undefined) {
            return `${boolValue ? '' : 'not '}${filter.prop.name}`;
          }
          return '';
        })
          .join(' ');
    },
  },
  methods: {
    async createArticle() {
      await Article.create({ props: this.filters });
    },
    arrayToFilters() {
      return ({ props }) => !this.filters.find(filter => props[filter.propId]);
    },
  },
  data() {
    return {
      filters: [],
    };
  },
  components: { PropertyMatcher },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.name {
  margin: $margin-top auto;
}

label {
  margin-right: $padding;
}

</style>
