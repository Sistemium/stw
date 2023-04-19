<template lang="pug">

.home
  img(alt="Vue logo" src="../assets/logo.png")
  hello-world(:msg="$t('message')")

</template>
<script>

import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'HomePage',
  components: {
    HelloWorld,
  },
  created() {
    this.$debug('home');
  },
};

</script>
