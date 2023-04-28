<template lang="pug">

el-form-item.vat-mode-switch(
  :label="$t('fields.vatPrice')"
)
  el-switch(v-model="model")

</template>
<script setup lang="ts">

import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const model = computed({
  get() {
    return props.modelValue || false;
  },
  set(value) {
    emit('update:modelValue', value || false);
  },
});

</script>
