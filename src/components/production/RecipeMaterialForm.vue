<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.recipe-material-form(
  ref="form"
  :model="model"
  :rules="rules"
  :disabled="disabled"
)
  el-form-item(prop="articleId")
    article-select(
      :storage-id="currentStorageId"
      v-model="model.articleId"
    )
  el-form-item(
    :label="$t('units.quantityOf', [$t(`units.genitive.${measureUnitId}`)])"
    prop="units"
  )
    el-input-number(v-model="model.units" :min="0")
  slot

</template>
<script setup lang="ts">

import { computed, watch } from 'vue';
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue';
import * as Measure from '@/models/Measure.js';
import ArticleModel  from '@/models/Article.js';
import type { MaterialFields } from '@/models/Recipes';
import { $requiredRule } from '@/lib/validations';
import { useFormValidate } from '@/services/validating';
import { useInvStore } from '@/store/invStore'
/* eslint-disable vue/no-mutating-props */

const props = defineProps<{
  model: Partial<MaterialFields>;
  disabled?: boolean;
}>();

const invStore = useInvStore()
const currentStorageId = computed(() => invStore.currentStorageId)
const article = computed(() => ArticleModel.reactiveGet(props.model?.articleId));
const measureUnitId = computed(() => article.value?.measureUnitId || Measure.DEFAULT_MEASURE_UNIT_ID);
const measureId = computed(() => article.value?.measureId || Measure.DEFAULT_MEASURE_ID);
const rules = $requiredRule(['articleId', 'units']);
const { form, validate } = useFormValidate();

watch(article, () => {
  props.model.measureUnitId = measureUnitId.value;
  props.model.measureId = measureId.value;
});

defineExpose({ validate });

</script>
<style scoped lang="scss">
.article-select {
  width: 100%;
}
.el-form-item {
  text-align: right;
}
</style>
