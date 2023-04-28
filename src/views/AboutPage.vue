<template lang="pug">

.about
  h1 {{ $t('about') }}
  .version v{{ version }}

</template>
<script setup>

import { computed } from 'vue';
import packageJson from '../../package.json';

const version = computed(() => packageJson.version);

</script>
