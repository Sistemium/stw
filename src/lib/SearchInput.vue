<template lang="pug">

el-input.search-input(
  prefix-icon="el-icon-search"
  v-model="searchText"
  :clearable="true"
  :placeholder="placeholder"
  :size="size"
  :disabled="disabled"
)

</template>
<script>

import debounce from 'lodash/debounce';

export default {

  name: 'SearchInput',

  props: {
    disabled: Boolean,
    size: {
      type: String,
    },
    value: String,
    // placeholder: String,
    debounce: {
      type: Number,
      default: 500,
    },
  },

  computed: {
    placeholder() {
      return this.$t('search');
    },
  },

  data() {
    return { searchText: this.value };
  },

  created() {
    this.$watch('searchText', debounce(value => this.$emit('input', value), this.debounce));
  },

  watch: {
    value(newValue) {
      this.searchText = newValue || '';
    },
  },

};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.el-input {
  width: unset;
}

</style>
