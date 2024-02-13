<template lang="pug">

el-select.measure-select(
  :model-value="modelValue"
  :clearable="true"
  @change="data => emit('change', data)"
  @update:model-value="id => emit('update:model-value', id)"
)
  el-option(
    v-for="{id} in measures"
    :key="id"
    :value="id"
    :label="$t(`measures.${id}`)"
  )

</template>
<script setup lang="ts">

import { computed } from 'vue';
import { measures as measuresFn } from '@/models/Measure.js';

defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
  (e: 'change', value: string): void;
}>();

const measures = computed(measuresFn);

</script>
