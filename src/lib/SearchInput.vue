<template lang="pug">

el-input.search-input(
  v-model="searchText"
  prefix-icon="el-icon-search"
  :clearable="true"
  :placeholder="placeholder"
  :size="size"
  :disabled="disabled"
)

</template>
<script setup>

import debounce from 'lodash/debounce';
import { computed, ref, watch } from 'vue';
import i18n from '@/i18n';

const props = defineProps({
  disabled: Boolean,
  size: {
    type: String,
  },
  modelValue: String,
  // placeholder: String,
  debounce: {
    type: Number,
    default: 500,
  },
});

const emit = defineEmits(['update:modelValue']);

const placeholder = computed(() => i18n.global.t('search'));

const searchText = ref(props.modelValue);

watch(searchText, debounce(value => emit('update:modelValue', value), props.debounce));
watch(() => props.modelValue, newValue => {
  searchText.value = newValue || '';
});

</script>
<style scoped lang="scss">

@import "../styles/variables";

.el-input {
  width: unset;
}

</style>
