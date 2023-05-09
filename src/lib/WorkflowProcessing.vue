<template lang="pug">

.processing() {{ $t(`workflow.${ processing || 'progress' }`) }}

</template>
<script setup lang="ts">

defineProps<{
  processing?: string;
}>();

</script>
<style scoped lang="scss">

</style>
