<template lang="pug">

el-menu.app-menu(
  :key="$i18n.locale"
  mode="horizontal"
  router
  :default-active="route.path"
)

  el-menu-item-group(v-if="$slots.left")
    slot(name="left")

  lang-menu(
    :languages="languages"
    trigger="click"
    size="default"
    v-model="$i18n.locale"
  )

  el-menu-item(
    v-for="{ t, path } in menu.rootItems"
    :key="t"
    :index="path"
  ) {{ $t(t) }}

  el-sub-menu(
    v-for="grp in menu.groups"
    :key="grp.name"
    :index="grp.name"
  )
    template(#title)
      .strong {{ $t('menu.other') }}
    el-menu-item(
      v-for="{ t, path } in grp.items"
      :key="t"
      :index="path"
    ) {{ $t(t) }}

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

const route = useRoute()
const languages: Language[] = [...Languages]

const menu = computed(() => {
  const items = routes
    .filter(({ meta }) => !meta || !meta.menuHidden)
    .map(({ name, path, meta }) => ({
      path,
      name,
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
</style>
