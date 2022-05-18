<template lang="pug">

  .prop-value-input
    el-select(
      v-if="prop.valueType === VALUE_TYPES.options"
      allow-create
      filterable
      default-first-option
      v-model="selectedValue"
      size="small"
    )
      el-option(label="Test" value="test")

</template>
<script>

import { VALUE_TYPES } from '@/models/ArticleProp';

export default {
  name: 'PropValueInput',
  props: {
    prop: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return { selectedValue: null };
  },
  computed: {
    VALUE_TYPES: () => VALUE_TYPES,
  },
  methods: {
    selected(value) {
      this.$debug('selected', value);
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

</style>
