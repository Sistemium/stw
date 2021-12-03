<template lang="pug">

  #app
    app-menu
    router-view

</template>
<script>

import AppMenu from '@/components/AppMenu.vue';

export default {
  components: { AppMenu },
};

</script>
<style lang="scss">

@import "styles/variables";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $black;
}

</style>
