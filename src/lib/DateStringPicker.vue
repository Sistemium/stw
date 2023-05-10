<template lang="pug">

el-date-picker.date-string-picker(
  type="date"
  v-model="date"
  :default-time="defaultTime"
)

</template>
<script setup>

import isDate from 'lodash/isDate';
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const defaultTime = new Date();
const date = computed({
  get() {
    const { modelValue: value } = props;
    if (!value) {
      return null;
    }
    return value && isDate(value) ? value : new Date(value);
  },
  set(value) {
    emit('update:modelValue', value ? value.toJSON() : null);
  },
});

</script>
