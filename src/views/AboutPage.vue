<template lang="pug">

.about
  page-title(title="menu.about")
  h3 {{ $t('about') }}
  .version v{{ version }}

</template>
<script setup>

import { computed } from 'vue';
import packageJson from '../../package.json';
import PageTitle from '@/components/PageTitle.vue';

const version = computed(() => packageJson.version);

</script>
