<template lang="pug">

el-select.article-select(
  filterable
  v-model="currentId"
)
  el-option(
    v-for="item in options"
    :key="item.id"
    :label="item.name"
    :value="item.id"
  )

</template>
<script>

import Article from '@/models/Article';

export default {
  name: 'ArticleSelect',
  props: {
    value: String,
  },
  computed: {
    options() {
      return this.$orderBy(Article.reactiveFilter());
    },
    currentId: {
      get() {
        return this.value;
      },
      set(id) {
        this.$emit('input', id);
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
