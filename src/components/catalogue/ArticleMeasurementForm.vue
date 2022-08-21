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

  el-form-item(:label="$t('fields.measureUnit')")
    el-select.measure-unit(v-model="model.measureUnitId")
      el-option(
        v-for="{id, name} in measureUnits"
        :key="id"
        :value="id"
        :label="name"
      )

  el-form-item(:label="$t('concepts.packageType')")
    el-select(v-model="model.packageTypeId")
      el-option(
        v-for="{id, name} in packageTypes"
        :key="id"
        :value="id"
        :label="name"
      )

  el-form-item(:label="$t('fields.unitsInPackage')")
    el-input-number(v-model="model.unitsInPackage")

</template>
<script>
/* eslint-disable vue/no-mutating-props */
import { measures, keyedMeasures } from '@/models/Measure';
import { packageTypes } from '@/models/PackageType';

export default {
  name: 'ArticleMeasurementForm',
  props: {
    model: Object,
  },
  computed: {
    keyedMeasures,
    measures,
    packageTypes() {
      return packageTypes();
    },
    unitIds() {
      return Object.keys();
    },
    measureUnits() {
      const { measureId } = this.model;
      if (!measureId) {
        return [];
      }
      const { unit } = this.keyedMeasures[measureId];
      return Object.keys(unit)
        .map(id => ({
          id,
          name: this.$t(`units.${id}`),
          ratio: unit[id],
        }));
    },
    defaultUnitId() {
      return this.$get(this.$find(this.measureUnits, { ratio: 1 }), 'id') || null;
    },
  },
  methods: {
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
    onChange(measureId) {
      const { measureUnitId } = this.model;
      this.$debug('onChange', measureId, measureUnitId, this.model.measureId);
      if (!measureUnitId || !this.$find(this.measureUnits, { id: measureUnitId })) {
        this.$set(this.model, 'measureUnitId', this.defaultUnitId);
      }
    },
  },
};

</script>
<style scoped lang="scss">

</style>
