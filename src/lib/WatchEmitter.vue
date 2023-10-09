<template lang="pug">
div(style="display: none")
</template>

<script setup lang="ts">
import { watch } from 'vue';
import debounce from 'lodash/debounce';

const props = defineProps<{
  value: number;
}>();

const emit = defineEmits<{
  (e: 'change', value: number): void;
}>();

const debounced = debounce(value => {
  emit('change', value);
}, 500);

watch(() => props.value, debounced);

emit('change', props.value);

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
