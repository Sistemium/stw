<template lang="pug">
.hello
  h1 {{ msg }}

</template>
<script setup lang="ts">

defineProps<{
  msg?: string;
}>();

</script>
