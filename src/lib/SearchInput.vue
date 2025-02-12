<template lang="pug">

el-input.search-input(
  v-model="searchText"
  :prefix-icon="Search"
  :clearable="true"
  :placeholder="placeholder"
  :size="size"
  :disabled="disabled"
)
  template(#append v-if="$slots.append")
    slot(name="append")

</template>
<script setup lang="ts">

import debounceFn from 'lodash/debounce';
import { computed, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import i18n from '@/i18n';
import type { ElementsSize } from '@/types/elements'

const props = withDefaults(defineProps<{
  disabled?: boolean
  size?: ElementsSize
  debounce?: number
  modelValue?: string
}>(), { debounce: 500 });

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();
const placeholder = computed(() => i18n.global.t('search'));
const searchText = ref(props.modelValue);

watch(searchText, debounceFn(value => emit('update:modelValue', value), props.debounce));
watch(() => props.modelValue, newValue => {
  searchText.value = newValue || '';
});

defineSlots<{
  append(): void
}>()

</script>
<style scoped lang="scss">

@import "../styles/variables";

.el-input {
  width: unset;
}

</style>
