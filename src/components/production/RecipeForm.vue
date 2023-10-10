<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.recipe-form(
  ref="form"
  :model="model"
)
  el-form-item(
    prop="isSKU"
    :label="$t('fields.isSKU')"
  )
    el-switch(v-model="model.isSKU")

  materials-form(
    :materials="model.materials || null"
    ref="materialsFormRef"
    @create="onCreate"
  )
    template(
      #material="{ material: material }"
      v-if="storageId"
    )
      article-cost-info(
        v-if="material?.articleId && storageId && date"
        :article-id="material.articleId"
        :storage-id="storageId"
        :date="date"
        :vat-prices="vatPrices"
        :vat-rate="vatRate"
        :units="material.units"
      )

</template>
<script setup lang="ts">

import { ref } from 'vue';
import type { Article } from '@/models/Articles';
import MaterialsForm from '@/components/production/MaterialsForm.vue';
import ArticleCostInfo from '@/components/production/ArticleCostInfo.vue';
import type { CostType } from '@/models/Recipes';
// import { useFormValidate } from '@/services/validating';

const props = defineProps<{
  model: Article;
  storageId?: string;
  date: string;
  vatRate: number;
  vatPrices: boolean;
  costType: CostType;
}>();

const materialsFormRef = ref(null);

defineExpose({
  validate(callback) {
    materialsFormRef.value.validate(callback);
  },
});

function onCreate(materials) {
  // eslint-disable-next-line vue/no-mutating-props
  props.model.materials = materials;
}

</script>
