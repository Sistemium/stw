<template lang="pug">

  .app-menu
    #nav
      router-link(to="/") {{ $t('menu.home') }}
      = ' | '
      router-link(to="/about")  {{ $t('menu.about') }}
    lang-menu(:languages="languages")

</template>
<script>

import LangMenu from '@bit/sistemium.vue.lang-menu';
import Language from '@/models/Language';

export default {
  name: 'AppMenu',
  computed: {
    languages() {
      return [...Language];
    },
  },
  components: {
    LangMenu,
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.app-menu {
  padding: 30px;
  text-align: center;
  position: relative;
}

.lang-menu {
  position: absolute;
  top: 0;
  right: 0;
}

#nav {

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
