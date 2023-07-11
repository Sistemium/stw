<template lang="pug">

h1.page-title {{ $t(title) }}
  slot

</template>
<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import { useTitle } from '@vueuse/core';
import { t } from '@/lib/validations';

const props = defineProps<{
  title: string;
}>();

watch(() => props.title, title => {
  if (!title) {
    return 'STW';
  }
  useTitle(`${t(title)} | STW`);
}, { immediate: true });

onBeforeUnmount(() => {
  useTitle('STW');
});

</script>
<style scoped lang="scss">
@import "../styles/responsive";

h1 {
  margin-bottom: $margin-top;
  @include xxs() {
    display: none;
  }
}
</style>
