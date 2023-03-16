<template lang="pug">

el-tabs.stock-operation-item-form(:class="tabClass")
  el-tab-pane(:label="$t('concepts.article')")
    stock-taking-item-form(
      :model="model"
      :editable="editable"
      ref="itemForm"
    )
      template(v-slot:article-extra)
        vat-mode-switch(v-model="formVatPrices" v-if="editable")
        price-form(:model="model" :vat-prices="formVatPrices")
  el-tab-pane(:label="$t('menu.materials')" v-if="model.materials")
    el-form(:model="model" :disabled="!editable")
      materials-form(:materials="model.materials")

</template>
<script>

import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import MaterialsForm from '@/components/production/MaterialsForm.vue';
import PriceForm from '@/components/out/PriceForm.vue';
import Article from '@/models/Article';
import VatModeSwitch from '@/components/out/VatModeSwitch.vue';

export default {
  name: 'StockOperationItemForm',
  components: {
    VatModeSwitch,
    PriceForm,
    StockTakingItemForm,
    MaterialsForm,
  },
  props: {
    editable: Boolean,
    model: Object,
    vatPrices: Boolean,
  },
  data() {
    return {
      formVatPrices: this.vatPrices,
    };
  },
  methods: {
    validate(cb) {
      const { itemForm } = this.$refs;
      const { form } = itemForm.$refs;
      // this.$debug('validate:', form, itemForm);
      if (!form) {
        cb(false);
        return;
      }
      form.validate(cb);
    },
  },
  computed: {
    article() {
      return Article.reactiveGet(this.model.articleId);
    },
    articleMaterials() {
      const { materials = null } = this.article || {};
      return materials;
    },
    tabClass() {
      return !this.articleMaterials && 'single';
    },
  },
  created() {
    this.$watch('model.articleId', () => {
      Vue.set(this.model, 'materials', cloneDeep(this.articleMaterials));
    });
  },
};

</script>
<style scoped lang="scss">
.el-tabs.single ::v-deep .el-tabs__header {
  display: none;
}
</style>
