<template lang="pug">

.simple-label {{ $t(text) }}

</template>
<script setup lang="ts">

defineProps<{
  text: string;
}>();

</script>
<style scoped lang="scss">
@import "../styles/variables";

.simple-label {
  font-size: 10px;
  padding: 0 $padding;
  display: inline;
  border: $list-cell-borders;
  border-radius: $padding;
  margin-right: $padding;
  font-weight: normal;
}

</style>
