<template lang="pug">

el-select.measure-select(
  @change="data => $emit('change', data)"
  :value="value"
  @input="id => $emit('input', id)"
)
  el-option(
    v-for="{id} in measures"
    :key="id"
    :value="id"
    :label="$t(`measures.${id}`)"
  )

</template>
<script>

import { measures } from '@/models/Measure';

export default {
  name: 'MeasureSelect',
  computed: {
    measures,
  },
  props: {
    value: String,
  },
};

</script>
<style scoped lang="scss">

</style>
