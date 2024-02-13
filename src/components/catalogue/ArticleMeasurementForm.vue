<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.article-measurement-form(
  ref="form"
  :model="model"
  :rules="rules"
)

  el-form-item(:label="$t('fields.measure')")
    measure-select(
      v-model="model.measureId"
      @change="onChange"
    )

  el-form-item(
    v-if="model.measureId"
    :label="$t('fields.measureUnit')"
  )
    measure-unit-select(
      v-model="model.measureUnitId"
      :measure-id="model.measureId"
    )

  el-form-item(:label="$t('concepts.packageType')")
    el-select(
      v-model="model.packageTypeId"
      :clearable="true"
      @change="packageTypeChange"
    )
      el-option(
        v-for="{id, name} in packageTypes"
        :key="id"
        :value="id"
        :label="name"
      )

  el-form-item(
    v-if="model.packageTypeId"
    :label="unitsInPackageLabel"
    prop="unitsInPackage"
  )
    el-input-number(
      v-model="model.unitsInPackage"
      v-select-on-focus
      :min="1"
    )

</template>
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed } from 'vue';
import find from 'lodash/find';
import get from 'lodash/get';
import { measureUnits as measureUnitsFn, DEFAULT_MEASURE_UNIT_ID } from '@/models/Measure.js';
import {
  packageTypes as packageTypesFn,
  unitsInPackageLabel as unitsInPackageLabelFn,
} from '@/models/PackageType.js';
import MeasureUnitSelect from '@/components/select/MeasureUnitSelect.vue';
import MeasureSelect from '@/components/select/MeasureSelect.vue';
import type { IArticle } from '@/models/Articles';
import { $requiredRule } from '@/lib/validations';
import { useFormValidate } from '@/services/validating';


const props = defineProps<{
  model: IArticle,
}>();

const { form, validate } = useFormValidate();

defineExpose({ validate });

const unitsInPackageLabel = computed(() => {
  const id = props.model.measureUnitId || DEFAULT_MEASURE_UNIT_ID;
  return unitsInPackageLabelFn(id);
});

const measureUnits = computed(() => measureUnitsFn(props.model.measureId));
const packageTypes = packageTypesFn();
const defaultUnitId = computed(() => {
  return get(find(measureUnits.value, { ratio: 1 }), 'id') || null;
});

const rules = computed(() => {
  const res = {};
  if (props.model.packageTypeId) {
    Object.assign(res, $requiredRule('unitsInPackage'));
  }
  return res;
});

function packageTypeChange(packageTypeId) {
  if (!packageTypeId) {
    props.model.unitsInPackage = null;
  }
}

// function onAdd() {
//   if (!props.model.measures) {
//     props.model.measures = [];
//   }
//   props.model.measures.push({
//     measureId: null,
//     unitId: null,
//     units: null,
//   });
// }

function onChange() {
  const { measureUnitId } = props.model;
  if (!measureUnitId || !find(measureUnits.value, { id: measureUnitId })) {
    props.model.measureUnitId = defaultUnitId.value;
  }
}

</script>
<style scoped lang="scss">

</style>
