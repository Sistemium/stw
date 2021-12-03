<template lang="pug">

  .home
    img(alt="Vue logo" src="../assets/logo.png")
    hello-world(:msg="$t('message')")
  </div>

</template>
<script>

import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};

</script>
