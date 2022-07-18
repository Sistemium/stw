<template lang="pug">

.article-matcher

  property-matcher(:title="title" v-model="filters")

  resize(:padding="20")
    article-list.articles(
      v-if="showArticles"
      :articles="filteredArticles"
      @click="article => $emit('found', article)"
    )
      template(v-slot:header)
        .list-group-header
          .compound-name
            simple-label(text="fields.name")
            strong {{ compoundName }}
          .create(v-if="allowCreate")
            el-button.create(type="success" v-t="'createArticle'" @click="onCreateClick")
      template(v-slot:footer)
        .list-group-item.no-articles(v-if="!filteredArticles.length")
          .no-matches(v-t="'noMatches'")

</template>
<script>
import PropertyMatcher from '@/components/props/PropertyMatcher.vue';
import Article from '@/models/Article';
import fpPick from 'lodash/fp/pick';
import keyBy from 'lodash/keyBy';
import { createNamespacedHelpers } from 'vuex';

import * as catalogue from '@/services/catalogue';
import { ARTICLE_FILTERS } from '@/store/inv/getters';
import { SET_ARTICLE_FILTERS } from '@/store/inv/mutations';
import { VALUE_TYPES } from '@/models/ArticleProp';
import ArticleList from '@/components/catalogue/ArticleList.vue';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

const PICK_PROPS = fpPick([
  'propId',
  'optionId',
  'boolValue',
  'stringValue',
  'numberValue',
  'type',
]);

export default {
  name: 'ArticleMatcher',
  props: {
    title: String,
  },
  computed: {
    filters: {
      ...mapGetters({ get: ARTICLE_FILTERS }),
      ...mapMutations({ set: SET_ARTICLE_FILTERS }),
    },
    filteredArticles() {
      return this.filters.length ? Article.reactiveFilter(this.arrayToFilters()) : [];
    },
    allowCreate() {
      const { compoundName, filteredArticles } = this;
      return compoundName && !filteredArticles.find(a => a.name === compoundName);
    },
    showArticles() {
      return this.compoundName || this.filteredArticles.length;
    },
    compoundName() {
      return catalogue.compoundName(this.filters);
    },
  },
  methods: {
    async createArticle() {
      const props = this.filters.map(PICK_PROPS);
      const article = await Article.create({
        props,
        name: this.compoundName,
      });
      this.$emit('found', article);
    },
    arrayToFilters() {
      return ({ props }) => {
        const byId = keyBy(props, 'propId');
        const notMatching = this.filters.find(filter => {
          const prop = byId[filter.propId];
          if (!prop) {
            return true;
          }
          const valueName = VALUE_TYPES[filter.prop.type];
          const filterValue = filter[valueName];
          const isEmpty = filterValue === null || filterValue === undefined;
          return !isEmpty && filterValue !== prop[valueName];
        });
        return !notMatching;
      };
    },
    onCreateClick() {
      this.$saveWithLoading(this.createArticle);
    },
  },
  data() {
    return {
      // filters: [],
    };
  },
  components: {
    ArticleList,
    PropertyMatcher,
  },
  i18n: {
    messages: {
      en: {
        createArticle: 'Create',
        noMatches: 'No matching articles',
      },
      lt: {
        createArticle: 'Sukurti',
        noMatches: 'Nėra tinkamos nomenklatūros',
      },
      ru: {
        createArticle: 'Создать',
        noMatches: 'Нет подходящей номенклатуры',
      },
    },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.articles {
  margin: $margin-top auto;
}

.list-group {
  max-width: $max-width;
  margin-left: auto;
  margin-right: auto;
}

.list-group-header {
  display: flex;
}

.compound-name {
  flex: 1;
  align-items: center;
}

.no-matches {
  color: $orange;
}

.el-button.create {
  padding: 3px 6px;
}

</style>
