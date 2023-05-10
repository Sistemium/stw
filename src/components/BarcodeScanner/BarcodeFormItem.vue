<template lang="pug">

el-form-item.barcode-form-item(
  :label="$t('fields.barcode')"
  :prop="prop"
)
  el-input(v-model="barcode")
    template(#prepend)
      slot(name="prepend")
    template(#append)
      el-button(
        icon="el-icon-close"
        @click="barcode = ''"
      )

</template>
<script setup lang="ts">

import { computed } from 'vue';

const props = defineProps({
  prop: {
    type: String,
    default: 'barcode',
  },
  modelValue: String,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string);
}>();

const barcode = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

</script>
