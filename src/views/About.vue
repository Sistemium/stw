<template lang="pug">
  .about
    h1 {{ $t('about') }}
    hello-i18n
</template>
<script>

import HelloI18n from '@/components/HelloI18n.vue';

export default {
  components: { HelloI18n },
};

</script>
