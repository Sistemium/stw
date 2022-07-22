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
  template(v-slot:empty)
    slot(name="empty")

</template>
<script>

import Article from '@/models/Article';

export default {
  name: 'ArticleSelect',
  props: {
    value: String,
    filters: {
      type: [Object, Function],
      default() {
        return {};
      },
    },
  },
  computed: {
    options() {
      return this.$orderBy(Article.reactiveFilter(this.filters), ['name']);
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
  watch: {
    options: {
      immediate: true,
      handler(options) {
        if (options.length === 1) {
          this.currentId = options[0].id;
          return;
        }
        if (this.currentId && !options.find(({ id }) => id === this.currentId)) {
          this.currentId = null;
        }
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
