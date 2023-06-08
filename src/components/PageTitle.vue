<template lang="pug">

h1.page-title {{ $t(title) }}
  slot

</template>
<script setup lang="ts">

defineProps<{
  title: string;
}>();

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
