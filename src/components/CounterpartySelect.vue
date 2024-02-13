<template lang="pug">

el-select.counterparty-select(
  ref="select"
  filterable
  remote
  :placeholder="$t('typeToSearch')"
  :remote-method="remoteMethod"
  :loading="loading"
  v-model="counterpartyId"
  v-if="type"
  :debounce="300"
  v-cancel-read-only
)
  el-option(
    v-for="item in options"
    :key="item.id"
    :label="item.name"
    :value="item.id"
  )

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import orderBy from 'lodash/orderBy';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import { CONSIGNEE_TYPES } from '@/services/warehousing.js';
import type { CounterpartyType } from '@/models/StockOperations';

const props = defineProps<{
  type: CounterpartyType;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>();

const loading = ref(false);
const remoteOptions = ref([]);
const model = computed(() => CONSIGNEE_TYPES.get(props.type));

const remoteMethod = computed(() => {
  return props.type === 'Storage' ? null : debounce(searcher, 300);
});

const options = computed(() => {
  const res = remoteMethod.value ? remoteOptions.value
    : (model.value && model.value.reactiveFilter({}));
  return orderBy(res, 'name');
});

const counterparty = computed(() => {
  const { value } = model;
  return value ? value.reactiveGet(props.modelValue) : null
});

const counterpartyId = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

watch(() => counterparty.value?.id, id => {
  if (id && !find(options.value, { id })) {
    remoteOptions.value = model.value.reactiveFilter();
  }
}, { immediate: true });

watch(() => props.type, () => {
  remoteOptions.value = [];
});

function searcher(query) {
  if (!query) {
    remoteOptions.value = model.value.reactiveFilter();
    return;
  }
  loading.value = true;
  model.value
    .findAll({
      'where:': { name: { like: query } },
    }, {
      headers: { 'x-page-size': 50 },
    })
    .then(records => {
      remoteOptions.value = records;
    })
    .finally(() => {
      loading.value = false;
    });
}

</script>
