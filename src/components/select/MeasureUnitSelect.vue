<template lang="pug">

el-select.measure-unit-select(
  :value="value"
  @input="unitId => $emit('input', unitId)"
)
  el-option(
    v-for="unit in measureUnits"
    :key="unit.id"
    :value="unit.id"
    :label="unit.name"
  )

</template>
<script>
import { measureUnits } from '@/models/Measure';

export default {
  name: 'MeasureUnitSelect',
  props: {
    value: String,
    measureId: { type: String, required: true },
  },
  computed: {
    measureUnits() {
      return measureUnits(this.measureId);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
