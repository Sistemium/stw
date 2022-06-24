<template lang="pug">

  .app-menu
    el-dropdown.hamburger
      el-button(circle icon="el-icon-menu" size="mini")
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item
          router-link(to="/" v-t="'menu.home'")
        el-dropdown-item
          router-link(to="/inventory" v-t="'menu.inventory'")
        el-dropdown-item
          router-link(to="/about" v-t="'menu.about'")
    #nav
      router-link(to="/" v-t="'menu.home'")
      = ' | '
      router-link(to="/inventory" v-t="'menu.inventory'")
      = ' | '
      router-link(to="/about" v-t="'menu.about'")
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
  @include responsive-only(xxs) {
    padding: 0 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.lang-menu {
  @include responsive-only(gt-xxs) {
    position: absolute;
    top: 0;
    right: 0;
  }
  @include responsive-only(xxs) {
    ::v-deep .el-icon-arrow-down {
      display: none;
    }
  }
}

#nav, .el-dropdown-menu {
  a {
    color: $black;

    &.router-link-exact-active {
      color: $green;
    }
  }
}

#nav {
  @include responsive-only(xxs) {
    display: none;
  }
  a {
    font-weight: bold;
  }
}

.hamburger {
  @include responsive-only(gt-xxs) {
    display: none;
  }
}

</style>
