<template lang="pug">

el-date-picker.date-string-picker(
  type="date"
  v-model="date"
  :default-time="defaultTime"
)

</template>
<script setup lang="ts">

import dayjs from 'dayjs'
import isDate from 'lodash/isDate';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string
  format?: string
}>();

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
    const out = (props.format && value) ? dayjs(value).format(props.format) : value?.toJSON()
    emit('update:modelValue', value ? out : null);
  },
});

</script>
