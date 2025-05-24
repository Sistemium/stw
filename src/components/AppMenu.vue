<template lang="pug">

v-app-bar(
  :key="$i18n.locale"
  dense
  elevation="1"
)

  .app-menu
    v-btn(
      v-for="{ t, path } in menu.rootItems"
      :key="t"
      :to="path"
      variant="text"
      exact
    ) {{ $t(t) }}
    v-menu(
      v-if="menu.groups.length"
      offset-y
    )
      template(#activator="{ props }")
        v-btn.mx-2(
          v-bind="props"
          variant="text"
          append-icon="$mdiMenuDown"
        ) {{ $t('menu.other') }}

      v-list
        v-list-item(
          v-for="({ t, path }) in menu.groups.flatMap(g => g.items)"
          :key="t"
          :to="path"
          @click="$emit('navigate')"
        )
          v-list-item-title {{ $t(t) }}

  template(#append)
    slot(name="left" v-if="$slots.left")
    //.left()

    lang-menu(
      :languages="languages"
      v-model="$i18n.locale"
    )


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

.app-menu {
  text-align: center;
  overflow-x: auto;
  display: flex;
  padding: 0 2em;
  margin: auto;
}
</style>
