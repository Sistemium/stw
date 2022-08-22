<template lang="pug">

el-form.article-measurement-form

  el-form-item(:label="$t('fields.measure')")
    el-select.measure(v-model="model.measureId" @change="onChange")
      el-option(
        v-for="{id} in measures"
        :key="id"
        :value="id"
        :label="$t(`measures.${id}`)"
      )

  el-form-item(:label="$t('fields.measureUnit')" v-if="model.measureId")
    measure-unit-select(:measure-id="model.measureId" v-model="model.measureUnitId")

  el-form-item(:label="$t('concepts.packageType')")
    el-select(v-model="model.packageTypeId" :clearable="true" @change="packageTypeChange")
      el-option(
        v-for="{id, name} in packageTypes"
        :key="id"
        :value="id"
        :label="name"
      )

  el-form-item(
    :label="unitsInPackageLabel"
    v-if="model.packageTypeId"
  )
    el-input-number(
      v-model="model.unitsInPackage"
      v-select-on-focus
      :min="1"
    )

</template>
<script>
/* eslint-disable vue/no-mutating-props */
import { measures, measureUnits, DEFAULT_MEASURE_UNIT_ID } from '@/models/Measure';
import { packageTypes, unitsInPackageLabel } from '@/models/PackageType';
import MeasureUnitSelect from '@/components/select/MeasureUnitSelect.vue';

export default {
  name: 'ArticleMeasurementForm',
  components: { MeasureUnitSelect },
  props: {
    model: Object,
  },
  computed: {
    measures,
    unitsInPackageLabel() {
      return unitsInPackageLabel(this.model.measureUnitId || DEFAULT_MEASURE_UNIT_ID);
    },
    measureUnits() {
      return measureUnits(this.model.measureId);
    },
    packageTypes() {
      return packageTypes();
    },
    defaultUnitId() {
      return this.$get(this.$find(this.measureUnits, { ratio: 1 }), 'id') || null;
    },
  },
  methods: {
    packageTypeChange(packageTypeId) {
      if (!packageTypeId) {
        this.model.unitsInPackage = null;
      }
    },
    onAdd() {
      if (!this.model.measures) {
        this.model.measures = [];
      }
      this.model.measures.push({
        measureId: null,
        unitId: null,
        units: null,
      });
    },
    onChange() {
      const { measureUnitId } = this.model;
      if (!measureUnitId || !this.$find(this.measureUnits, { id: measureUnitId })) {
        this.$set(this.model, 'measureUnitId', this.defaultUnitId);
      }
    },
  },
};

</script>
<style scoped lang="scss">

</style>
