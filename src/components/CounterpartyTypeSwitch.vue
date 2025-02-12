<template lang="pug">

el-radio-group.counterparty-type-switch(
  v-model="type"
  @change="x => emit('change', x || null)"
)
  el-radio-button(value="LegalEntity") {{ $t('concepts.legalEntity') }}
  //el-radio-button(value="Person") {{ $t('concepts.person') }}
  el-radio-button(value="Storage") {{ $t('concepts.storage') }}
  el-radio-button(:value="false") {{ $t('concepts.unknown') }}

</template>
<script setup lang="ts">

import { computed } from 'vue';
import type { CounterpartyType } from '@/models/StockOperations';

const props = withDefaults(defineProps<{
  modelValue?: CounterpartyType;
}>(), { modelValue: null });

const emit = defineEmits<{
  (e: 'update:modelValue', value: CounterpartyType);
  (e: 'change', value: CounterpartyType);
}>();

const type = computed({
  get() {
    return props.modelValue || false;
  },
  set(value) {
    emit('update:modelValue', value || null);
  },
});

</script>
