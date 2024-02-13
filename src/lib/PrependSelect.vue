<template lang="pug">

button-prepend.prepend-select(@button-click="emit('buttonClick')")
  el-select(
    filterable
    :model-value="modelValue"
    @change="v => emit('update:modelValue', v)"
  )
    slot

</template>
<script setup lang="ts">

import ButtonPrepend from '@/lib/ButtonPrepend.vue';

defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'buttonClick') : void;
  (e: 'update:modelValue', value: string): void;
}>();

</script>
<style scoped lang="scss">

</style>
