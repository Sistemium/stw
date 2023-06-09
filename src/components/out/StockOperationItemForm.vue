<template lang="pug">

el-tabs.stock-operation-item-form(:class="tabClass")
  el-tab-pane(:label="$t('concepts.article')")
    stock-taking-item-form(
      :model="model"
      :editable="editable"
      ref="form"
    )
      template(#article-extra)
        vat-mode-switch(v-model="formVatPrices" v-if="editable")
        price-form(:model="model" :vat-prices="formVatPrices")
        article-cost-info(
          v-if="model.articleId && storageId && date"
          :article-id="model.articleId"
          :storage-id="storageId"
          :date="date"
          :vat-prices="formVatPrices"
          :vat-rate="vatRate"
          :materials="model.materials"
          :units="1"
          type="initCost"
        )
        article-cost-info(
          v-if="model.articleId && model.stockReceivingId && !editable"
          :article-id="model.articleId"
          :storage-id="storageId"
          :date="date"
          :vat-prices="formVatPrices"
          :vat-rate="vatRate"
          :materials="model.materials"
          :units="1"
          type="resultCost"
          :label-suffix="$t('after.stockReceiving')"
        )
  el-tab-pane(:label="$t('menu.materials')" v-if="model.materials")
    el-form(:model="model" :disabled="!editable")
      materials-form(:materials="model.materials" :disabled="!editable")
        template(#material="{ material: material }")
          article-cost-info(
            v-if="material?.articleId && storageId && date"
            :article-id="material.articleId"
            :storage-id="storageId"
            :date="date"
            :vat-prices="formVatPrices"
            :vat-rate="vatRate"
            :units="material.units"
          )

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import MaterialsForm from '@/components/production/MaterialsForm.vue';
import ArticleCostInfo from '@/components/production/ArticleCostInfo.vue';
import PriceForm from '@/components/out/PriceForm.vue';
import Article from '@/models/Article.js';
import VatModeSwitch from '@/components/out/VatModeSwitch.vue';
import type { StockOperationItem } from '@/models/StockOperations';
import { useFormValidate } from '@/services/validating';

const props = defineProps<{
  editable: boolean;
  model: StockOperationItem;
  vatPrices: boolean;
  vatRate?: number;
  storageId?: string;
  date?: string;
}>();

const { form, validate } = useFormValidate();

defineExpose({ validate });

const formVatPrices = ref(props.vatPrices);

const article = computed(() => Article.reactiveGet(props.model.articleId));
const articleMaterials = computed(() => {
  const { materials = null } = article.value || {};
  return materials;
});
const tabClass = computed(() => !articleMaterials.value && 'single');

watch(() => props.model.articleId, () => {
  // eslint-disable-next-line vue/no-mutating-props
  props.model.materials = cloneDeep(articleMaterials.value);
});

</script>
<style scoped lang="scss">
.el-tabs.single :deep(.el-tabs__header) {
  display: none;
}
</style>
