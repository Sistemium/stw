<template lang="pug">

.article-matcher

  property-matcher(:title="title" v-model="filters")

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
import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
import fpPick from 'lodash/fp/pick';
import keyBy from 'lodash/keyBy';
import trim from 'lodash/trim';
import { createNamespacedHelpers } from 'vuex';

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
      const res = this.filters
        && this.filters.map(filter => {
          const { stringValue, numberValue } = filter;
          const simple = stringValue || numberValue;
          if (simple) {
            const { prefix, suffix } = filter.prop || {};
            return [prefix, simple, suffix]
              .filter(a => a)
              .join('');
          }
          const { boolValue, prop } = filter;
          if (boolValue !== undefined && prop) {
            return boolValue ? prop.name : prop.inverse;
          }
          return '';
        })
          .filter(x => x)
          .map(lowerFirst)
          .join(' ');
      return upperFirst(trim(res));
    },
  },
  methods: {
    async createArticle() {
      const props = this.filters.map(PICK_PROPS);
      await Article.create({
        props,
        name: this.compoundName,
      });
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
