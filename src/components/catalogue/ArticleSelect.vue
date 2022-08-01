<template lang="pug">

el-select.article-select(
  filterable
  v-model="currentId"
  :filter-method="filterSearch"
  :debounce="300"
  v-cancel-read-only
)
  el-option(
    v-for="article in options"
    :key="article.id"
    :label="article.name"
    :value="article.id"
  )
    .name {{ article.name }}
    .code(v-if="article.code") {{ article.code }}
  template(v-slot:empty)
    slot(name="empty")

</template>
<script>

import Article from '@/models/Article';
import { searchArticle } from '@/services/catalogue';

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
  data() {
    return {
      search: '',
    };
  },
  computed: {
    options() {
      const { filters } = this;
      const all = Article.reactiveFilter(filters);
      const res = this.$get(filters, 'name') === 'barcodeFilter' ? all
        : all.filter(searchArticle(this.search));
      return this.$orderBy(res, ['name']);
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
  methods: {
    filterSearch(search) {
      this.$debug('search', search);
      this.search = search;
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
@import "../../styles/variables";

.el-select-dropdown__item {
  display: block;
  //flex-direction: column;
  height: auto;

  .code {
    line-height: 1;
    font-size: smaller;
    color: $light-gray;
    text-align: right;
  }
}
</style>
