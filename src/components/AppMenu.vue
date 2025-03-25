<template lang="pug">

el-menu.app-menu(
  :key="$i18n.locale"
  mode="horizontal"
  router
  :default-active="route.path"
)

  .left(v-if="$slots.left")
    slot(name="left")

  lang-menu(
    :languages="languages"
    trigger="click"
    size="default"
    v-model="$i18n.locale"
  )

  el-menu-item(
    v-for="{ t, path, href } in menu.rootItems"
    :key="t"
    :index="path"
  )
    a(:href="href") {{ $t(t) }}

  el-sub-menu(
    v-for="grp in menu.groups"
    :key="grp.name"
    :index="grp.name"
  )
    template(#title)
      .strong {{ $t('menu.other') }}
    el-menu-item(
      v-for="{ t, path, href } in grp.items"
      :key="t"
      :index="path"
    )
      template(#title)
        a(:href="href") {{ $t(t) }}

</template>
<script setup lang="ts">

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LangMenu from '@/components/LangMenu.vue'
import { routes } from '@/router'
import type Language from '@/models/Languages'
import { Languages } from '@/models/Languages'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import { useInvStore } from '@/store/invStore'

const store = useInvStore()
const route = useRoute()
const languages: Language[] = [...Languages]

const menu = computed(() => {
  const items = routes
    .filter(({ meta }) => !meta || !meta.menuHidden)
    .filter(({ meta }) => !meta?.role || store.hasRole(meta.role))
    .map(({ name, path, meta }) => ({
      path,
      name,
      href: `#${path}`,
      menuGroup: meta?.menuGroup || 'root',
      t: `menu.${name as string}`,
    }))

  const grouped = groupBy(items, 'menuGroup')

  return {
    rootItems: grouped.root,
    groups: map(grouped, (items, name) => ({ name, items }))
      .filter(({ name }) => name !== 'root') as Record<string, any>[]
  }

})

defineSlots<{
  left(): void
}>()

</script>
<style scoped lang="scss">
@import "../styles/responsive";

.left {
  position: absolute;
  top: 0;
  right: 70px;
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

a {
  text-decoration: none;
  color: unset;
}
</style>
