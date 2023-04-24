<template lang="pug">

.home
  img(alt="Vue logo" src="../assets/logo.png")
  hello-world(:msg="$t('message')")

</template>
<script setup lang="ts">

import HelloWorld from '@/components/HelloWorld.vue';

// this.$debug('home');
</script>
