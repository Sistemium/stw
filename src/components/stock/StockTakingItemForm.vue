<template lang="pug">

el-form.stock-taking-item-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="!editable"
)

  el-form-item.article(:label="$t('concepts.article')" prop="articleId")
    article-select(v-model="model.articleId")

  template(v-if="article")
    el-form-item.mode(:label="$t('fields.package')")
      el-radio-group(v-model="mode" @change="modeChange")
        el-radio-button(label="boxes") {{ $t('storage.boxes') }}
        el-radio-button(label="units") {{ $t('storage.units') }}

    template(v-if="mode==='boxes'")
      el-form-item(prop="boxRel" :label="$t('fields.boxRel')")
        el-input-number(v-model="model.boxRel" :min="1")

    el-form-item(
      prop="quantity"
      :label="$t(mode==='boxes' ? 'fields.boxQuantity' : 'fields.quantity')"
    )
      el-input-number(v-model="model.quantity" :min="1")

</template>
<script>
/* eslint-disable vue/no-mutating-props */
// import StockTakingItem from '@/models/StockTakingItem';
import Article from '@/models/Article';
import ArticleView from '@/components/catalogue/ArticleView.vue';
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue';

export default {
  name: 'StockTakingItemForm',
  props: {
    model: Object,
    editable: Boolean,
  },
  data() {
    return {
      mode: 'units',
    };
  },
  computed: {
    rules() {
      return {
        ...this.$requiredRule(['quantity', 'boxRel', 'articleId']),
      };
    },
    units() {
      return this.model.boxRel * this.model.quantity;
    },
    article() {
      const { articleId } = this.model;
      return Article.reactiveGet(articleId);
    },
  },
  methods: {
    modeChange(mode) {
      if (mode === 'boxes') {
        const { boxes } = this.article;
        const [box] = boxes || [];
        const { boxRel = 1 } = box || {};
        this.model.boxRel = boxRel;
      } else {
        this.model.boxRel = 1;
      }
    },
  },
  created() {
    this.$watchImmediate('units', units => {
      this.model.units = units;
    });
    this.$watchImmediate('model', model => {
      this.mode = model.boxRel > 1 ? 'boxes' : 'units';
    });
  },
  components: { ArticleSelect, ArticleView },
};

</script>
<style scoped lang="scss">

.el-form-item {
  text-align: right;

  &::after, &::before {
    display: none;
  }
}

.article-select {
  width: 100%;
}

</style>
