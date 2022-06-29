<template lang="pug">

.article-props
  article-props-list(:article-props="articleProps" @click="onPropClick")
  router-view

</template>
<script>
import ArticleProp from '@/models/ArticleProp';
import ArticlePropsList from '@/components/catalogue/ArticlePropsList.vue';

export default {
  name: 'ArticleProps',
  props: {
    editRoute: { type: String, required: true },
  },
  computed: {
    articleProps() {
      return ArticleProp.reactiveFilter();
    },
    showDrawer() {
      return this.$route.name === this.editRoute;
    },
  },
  methods: {
    onPropClick(prop) {
      this.$router.push({
        name: this.editRoute,
        params: {
          articlePropId: prop.id,
        },
      });
    },
  },
  components: { ArticlePropsList },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

.article-props {
  max-width: $max-width;
  margin: 0 auto;
}

</style>
