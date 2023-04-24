<template lang="pug">

.app-menu

  el-dropdown.hamburger(@command="onCommand" trigger="click" size="normal")
    el-button(circle icon="el-icon-menu")
    template(#dropdown)
      el-dropdown-menu()
        el-dropdown-item(
          v-for="{ t, name } in menu" :key="t" :command="name"
          :disabled="name === $route.name"
        ) {{ $t(t) }}
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
    router-link(
      v-for="{ t, name } in menu"
      :key="t"
      :to="{ name }"
    ) {{ $t(t) }}

  lang-menu(
    :languages="languages"
    trigger="click"
    size="default"
    v-model="$i18n.locale"
  )

</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LangMenu from 'sistemium-vue/components/LangMenu.vue';
import { toggleTabBar, isNative as isNativeFn } from 'sistemium-data/src/util/native.js';
import { routes } from '@/router/index.js';
import i18n from '@/i18n.js';
import type Language from '@/models/Languages';
import { Languages } from '@/models/Languages';

const router = useRouter();
const route = useRoute();

const isNative = computed(isNativeFn);
const tabBarShown = ref(isNative.value ? toggleTabBar() : false);
const languages: Language[] = [...Languages];

const menu = computed(() => routes
  .filter(({ meta }) => !meta || !meta.menuHidden)
  .map(({ name }) => ({
    name,
    t: `menu.${name}`,
  })));

const tabBarIcon = computed(() => tabBarShown.value ? 'el-icon-user' : 'el-icon-user-solid');

const title = computed(() => {
  const { name } = route;
  if (!name) {
    return null;
  }
  const key = `menu.${name.toString()}`;
  const hasTitle = i18n.global.te(key);
  return hasTitle && i18n.global.t(key);
});

function onCommand(name) {
  if (name === 'toggleTabBar') {
    tabBarShown.value = toggleTabBar();
    return;
  }
  if (route.name !== name) {
    router.push({ name });
  }
}

</script>
<style scoped lang="scss">
@import "../styles/responsive";

.app-menu {
  padding: $margin-top;
  text-align: center;
  position: relative;
  @include xxs() {
    padding: 0 0 $padding;
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
  @include gt-xxs() {
    position: absolute;
    top: 0;
    right: 0;
  }
  @include xxs() {
    :deep(img) {
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

  margin: 0 $margin-top * 2;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @include xxs {
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
  @include gt-xxs() {
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
  @include gt-xxs() {
    position: absolute;
    top: 0;
    left: 0;
  }
  @include xxs() {
    margin-left: $margin-right;
  }
}

#nav > a {
  white-space: nowrap;
}

.tab-bar-toggle {
  @include xxs() {
    display: none;
  }
  position: absolute;
  top: 0;
  left: 0;
}

</style>
