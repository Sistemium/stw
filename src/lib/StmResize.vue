<template lang="pug">

.stm-resize(
  :style="style"
  ref="root"
)
  slot

</template>
<script setup lang="ts">

import debounce from 'lodash/debounce';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
  padding?: number;
  maximize?: boolean;
}>();

const emit = defineEmits<{
  (e: 'resized', height: number);
}>();

const root = ref(null);
const style = ref<{ [key: string]: string | number }>({});
const top = ref(0);
const height = ref(0);
const handleResize = debounce(setHeight, 700);

onMounted(() => {
  window.addEventListener('resize', handleResize);
  nextTick(() => {
    setHeight();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
})

function setHeight() {
  const { top: clientTop } = root.value.getBoundingClientRect();
  top.value = clientTop;
  height.value = window.innerHeight;
  const resized = height.value - top.value - (props.padding || 0);
  const maxHeight = `${resized}px`;
  style.value = { 'max-height': maxHeight };
  if (props.maximize) {
    style.value = { height: maxHeight };
  }
  emit('resized', resized);
}

</script>
<style scoped lang="scss">

.stm-resize {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  @media print {
    max-height: none !important;
    height: auto !important;
  }
}

</style>
