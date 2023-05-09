<template lang="pug">

el-select.article-select(
  v-model="currentId"
  v-cancel-read-only
  :clearable="true"
  :debounce="300"
  filterable
  :filter-method="filterSearch"
  :placeholder="placeholderValue"
  @change="changes => emit('update:modelValue', changes)"
)
  el-option(
    v-for="article in options"
    :key="article.id"
    :label="article.name"
    :value="article.id"
  )
    .name {{ article.name }}
    .code(v-if="article.code") {{ article.code }}
  template(#empty)
    slot(name="empty")

</template>
<script setup lang="ts">

import Article from '@/models/Article';
import { searchArticle } from '@/services/catalogue';
import i18n from '@/i18n.js';
import upperFirst from 'lodash/upperFirst';
import { computed, ref, watch } from 'vue';
import orderBy from 'lodash/orderBy';


const props = defineProps({
  modelValue: String,
  filters: {
    type: [Object, Function],
    default() {
      return {};
    },
  },
  placeholder: String,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null);
}>();

const placeholderValue = computed(() => {
  const string = i18n.global.t('actions.select', [i18n.global.t('accusative.article')]);
  return props.placeholder || upperFirst(string.toString());
});

const search = ref('');
const hasBarcodeFilter = computed(() => props.filters?.name === 'barcodeFilter');
const options = computed(() => {
  const filtered = Article.reactiveFilter(props.filters);
  const res = hasBarcodeFilter.value ? filtered : filtered.filter(searchArticle(search.value));
  return orderBy(res, ['name']);
});

const currentId = computed({
  get() {
    return props.modelValue;
  },
  set(id) {
    emit('update:modelValue', id);
  },
});

function filterSearch(str: string) {
  search.value = str;
}

watch(options, optionsValue => {
  if (!hasBarcodeFilter.value) {
    return;
  }
  if (optionsValue.length === 1) {
    currentId.value = optionsValue[0].id;
    return;
  }
  if (currentId.value && !optionsValue.find(({ id }) => id === currentId.value)) {
    currentId.value = null;
  }
}, { immediate: true });

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-select-dropdown__item {
  display: block;
  //flex-direction: column;
  height: auto;

  .code {
    line-height: 1;
    font-size: smaller;
    color: $light-gray;
    text-align: right;
  }
}
</style>
