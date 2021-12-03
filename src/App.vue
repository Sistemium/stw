<template lang="pug">

  #app

    app-menu

    router-view

</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
<script>

import AppMenu from '@/components/AppMenu.vue';

export default {
  components: { AppMenu },
};

</script>
