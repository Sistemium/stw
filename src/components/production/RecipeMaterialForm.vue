<template lang="pug">

.recipe-material-form
  el-form-item(prop="articleId")
    article-select(v-model="model.articleId")
  el-form-item(
    :label="$t('units.quantityOf', [$t(`units.genitive.${this.measureUnitId}`)])"
    prop="units"
  )
    el-input-number(v-model="model.units" :min="0")

</template>
<script>

import * as Measure from '@/models/Measure';
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue';
import Article from '@/models/Article';
/* eslint-disable vue/no-mutating-props */

export default {
  name: 'RecipeMaterialForm',
  components: { ArticleSelect },
  props: {
    model: { type: Object, required: true },
  },
  computed: {
    article() {
      const { articleId } = this.model;
      return Article.reactiveGet(articleId);
    },
    measureUnitId() {
      const { measureUnitId } = this.article || {};
      return measureUnitId || Measure.DEFAULT_MEASURE_UNIT_ID;
    },
    measureId() {
      const { measureId } = this.article || {};
      return measureId || Measure.DEFAULT_MEASURE_ID;
    },
  },
  methods: {
    onArticle() {
      this.model.measureUnitId = this.measureUnitId;
      this.model.measureId = this.measureId;
    },
  },
  created() {
    this.$watch('article', this.onArticle);
  },
};

</script>
<style scoped lang="scss">
.article-select {
  width: 100%;
}
.el-form-item {
  text-align: right;
}
</style>
