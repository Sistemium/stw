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
  :remote="true"
  :placeholder="placeholderValue"
  placement="bottom-end"
  @change="changes => emit('update:modelValue', changes)"
  @visible-change="onVisibleChange"
)
  template(#default="{ item: article }")
    .article-option
      article-avatar(
        :article="article"
      )
      .item
        .title
          .name {{ article.name }}
          small.supplier(v-if="article.supplier") {{ article.supplier.stringValue }}
        .info
          span.code(v-if="article.code") {{ article.code }}
          small.commentary(v-if="article.commentary") {{ article.commentary.stringValue }}
          article-stock-info(
            :article-id="article.id"
            :storage-id="storageId"
            :measure-unit-id="article.measureUnitId || 'piece'"
          )
      //.stock(v-if="storageId")
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
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';
import ArticleStockInfo from '@/components/catalogue/ArticleStockInfo.vue';
import type { IArticle as ArticleType } from '@/models/Articles'

defineSlots<{
  empty(): never
}>()

const { VITE_SUPPLIER_PROP, VITE_COMMENTARY_PROP } = import.meta.env;

const itemHeight = 50;

const props = withDefaults(defineProps<{
  modelValue?: string;
  filters?: Record<string, any> | ((a: ArticleType) => boolean);
  placeholder?: string;
  storageId?: string;
}>(), {
  filters: () => ({}),
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
  return orderBy(res, ['name'])
    .map(a => ({
      ...a,
      supplier: a.props.find(prop => prop.propId === VITE_SUPPLIER_PROP),
      commentary: a.props.find(prop => prop.propId === VITE_COMMENTARY_PROP),
    }));
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

function onVisibleChange(visible: boolean) {
  if (!visible) {
    filterSearch('')
  }
}

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.article-select {
  text-align: left;
}

.article-option {

  border-top: solid 1px $gray-border-color;
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;

  .item {
    line-height: 25px;
    margin-left: $padding;
    flex: 1;
  }

  .title {
    font-size: 13px;
    color: $black;
  }

  .info, .title {
    min-height: 25px;
    display: flex;
    align-items: center;
    > * + * {
      margin-left: $padding;
    }
  }

  .title {
    justify-content: space-between;
  }

  .article-stock-info {
    flex: 1;
    text-align: right;
  }

  .code {
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
