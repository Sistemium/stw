<template lang="pug">

v-chip.ma(
  size="small"
  variant="outlined"
  color="info"
  density="compact"
) {{ $t(text) }}

</template>
<script setup lang="ts">

defineProps<{
  text: string;
}>();

</script>
