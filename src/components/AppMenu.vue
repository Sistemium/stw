<template lang="pug">

.app-menu

  el-dropdown.hamburger(@command="onCommand" trigger="click" size="normal")
    el-button(circle icon="el-icon-menu")
    template(v-slot:dropdown)
      el-dropdown-menu()
        el-dropdown-item(
          v-for="{ t, name } in menu" :key="t" :command="name" v-t="t"
          :disabled="name === $route.name"
        )
        el-dropdown-item(
          v-if="isNative"
          command="toggleTabBar"
          :icon="tabBarIcon"
        ) {{ $tAction(tabBarShown ? 'hide' : 'show', 'profile') }}

  slot(name="left")
    el-button.tab-bar-toggle(
      circle
      :icon="tabBarIcon"
      v-if="isNative"
      @click="onCommand('toggleTabBar')"
    )

  .title
    strong {{ title }}

  #nav
    router-link(v-for="{ t, name } in menu" :key="t" :to="{ name }" v-t="t")

  lang-menu(:languages="languages" trigger="click" size="normal")

</template>
<script>

import LangMenu from 'sistemium-vue/components/LangMenu.vue';
import Language from '@/models/Language';
import { toggleTabBar, isNative } from 'sistemium-data/src/util/native';
import { routes } from '@/router';

export default {
  name: 'AppMenu',
  data() {
    return { tabBarShown: isNative() ? toggleTabBar() : null };
  },
  computed: {
    languages() {
      return [...Language];
    },
    menu() {
      return routes
        .filter(({ meta }) => !meta || !meta.menuHidden)
        .map(({ name }) => ({
          name,
          t: `menu.${name}`,
        }));
    },
    isNative() {
      return isNative();
    },
    tabBarIcon() {
      return this.tabBarShown ? 'el-icon-user' : 'el-icon-user-solid';
    },
    title() {
      return this.routeTitle(this.$route)
        || this.routeTitle(this.$router.currentRoute.matched[0]);
    },
  },
  methods: {
    onCommand(name) {
      if (name === 'toggleTabBar') {
        this.tabBarShown = toggleTabBar();
        return;
      }
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
    routeTitle(route) {
      const { name } = route || {};
      if (!name) {
        return null;
      }
      const key = `menu.${name}`;
      const hasTitle = this.$te(key);
      return hasTitle && this.$t(key);
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

.title {
  flex: 1;
  font-size: 18px;
}

.lang-menu {
  @include responsive-only(gt-xxs) {
    position: absolute;
    top: 0;
    right: 0;
  }
  @include responsive-only(xxs) {
    ::v-deep img {
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

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @include responsive-only(xxs) {
    display: none;
  }

  a {
    font-weight: bold;
    line-height: 25px;
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

.barcode-scanner-status {
  @include responsive-only(gt-xxs) {
    position: absolute;
    top: 0;
    left: 0;
  }
  @include responsive-only(xxs) {
    margin-left: $margin-right;
  }
}

#nav > a {
  white-space: nowrap;
}

.tab-bar-toggle {
  @include responsive-only(xxs) {
    display: none;
  }
  position: absolute;
  top: 0;
  left: 0;
}

</style>
