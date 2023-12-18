<template lang="pug">

el-select-v2.article-select(
  v-model="currentId"
  popper-class="article-select-popper"
  :options="options"
  :clearable="true"
  :debounce="300"
  :props="selectProps"
  :item-height="itemHeight"
  :height="itemHeight*6"
  :filterable="true"
  :remote-method="filterSearch"
  :placeholder="placeholderValue"
  @change="changes => emit('update:modelValue', changes)"
)
  template(#default="{ item: article }")
    .article-option
      .title
        .name {{ article.name }}
      .info
        .code(v-if="article.code") {{ article.code }}
  template(#empty)
    slot(name="empty")
      p.el-select-v2__empty {{ $t("validation.noData") }}

</template>
<script setup lang="ts">

import Article from '@/models/Article.js';
import { searchArticle } from '@/services/catalogue.js';
import i18n from '@/i18n';
import upperFirst from 'lodash/upperFirst';
import { computed, ref, watch } from 'vue';
import orderBy from 'lodash/orderBy';

defineSlots<{
  empty(): never
}>()

const itemHeight = 50;

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

const selectProps = {
  label: 'name',
  value: 'id',
};

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

.article-select {
  text-align: left;
}

.article-option {
  line-height: 25px;
  width: 100%;
  //display: flex;
  //flex-direction: row;
  //justify-content: space-between;

  .info {
    text-align: right;
  }

  .code {
    //line-height: 1;
    //font-size: smaller;
    color: $light-gray;
  }
}

</style>
<style lang="scss">
.article-select-popper {
  min-width: 600px;
  .el-select-dropdown__list {
    width: auto !important;
  }
  .el-select-dropdown__option-item.is-selected::after {
    display: none;
  }
}
</style>
