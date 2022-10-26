<template lang="pug">

.about
  h1 {{ $t('about') }}
  .version v{{ version }}

</template>
<script>

import { version } from '../../package.json';

export default {
  name: 'AboutPage',
  computed: {
    version() {
      return version;
    },
  },
};

</script>
