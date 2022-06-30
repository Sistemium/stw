<template lang="pug">

.article-matcher

  property-matcher(:title="title" v-model="filters")

  .list-group.articles(v-if="this.compoundName")
    .list-group-header
      .compound-name
        .label(size="mini" v-t="'fields.name'")
        strong {{ this.compoundName }}
      .create(v-if="allowCreate")
        el-button.create(type="success" v-t="'createArticle'" @click="onCreateClick" size="mini")
    .list-group-item.article(v-for="article in filteredArticles" :key="article.id")
      .name {{ article.name }}
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
import { createNamespacedHelpers } from 'vuex';

import { ARTICLE_FILTERS } from '@/store/inv/getters';
import { SET_ARTICLE_FILTERS } from '@/store/inv/mutations';
import { VALUE_TYPES } from '@/models/ArticleProp';

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
          .map(lowerFirst)
          .join(' ');
      return upperFirst(res);
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
          return filterValue !== null
            && filterValue !== undefined
            && filterValue !== prop[valueName];
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
  components: { PropertyMatcher },
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

.label {
  font-size: 10px;
  padding: 0 $padding;
  display: inline;
  border: $list-cell-borders;
  border-radius: $padding;
  margin-right: $padding;
  font-weight: normal;
}

</style>
