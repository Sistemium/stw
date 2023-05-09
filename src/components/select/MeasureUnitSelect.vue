<template lang="pug">

el-select.measure-unit-select(
  :model-value="modelValue"
  @update:model-value="unitId => emit('update:modelValue', unitId)"
)
  el-option(
    v-for="unit in units"
    :key="unit.id"
    :value="unit.id"
    :label="unit.name"
  )

</template>
<script setup lang="ts">
import { computed } from 'vue';
import { measureUnits } from '@/models/Measure.js';

const props = defineProps<{
  modelValue?: string;
  measureId: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string);
}>();

const units = computed(() => measureUnits(props.measureId));

</script>
