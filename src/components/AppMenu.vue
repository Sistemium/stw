<template lang="pug">

.app-menu

  el-dropdown.hamburger(@command="onCommand")
    el-button(circle icon="el-icon-menu" size="mini")
    el-dropdown-menu(slot="dropdown")
      el-dropdown-item(v-for="{ t, name } in menu" :key="t" :command="name" v-t="t")

  strong {{ title }}

  #nav
    router-link(v-for="{ t, name } in menu" :key="t" :to="{ name }" v-t="t")

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
    menu() {
      return ['home', 'inventory', 'about']
        .map(name => ({
          name,
          t: `menu.${name}`,
        }));
    },
    title() {
      const { name } = this.$route;
      return name ? this.$t(`menu.${name}`) : '';
    },
  },
  methods: {
    onCommand(name) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
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

  a + a:before {
    content: "|";
    padding: 0 $margin-right;
  }
}

strong, .hamburger {
  @include responsive-only(gt-xxs) {
    display: none;
  }
}

.hamburger {
  strong {
    text-align: left;
    flex: 1;
  }
}

</style>
