<template lang="pug">
.users-page.page.mx-auto(style="max-width: 1200px")
  page-title(title="menu.users")
  v-sheet
    .filters.d-flex
      search-input.flex-1-1(v-model="search")
    resize.mt-1(
      :padding="40"
      :scrollable="false"
    )
      template(#default="{ resized }")
        user-table(
          :users="users"
          :height="resized"
          :active-id="currentUserId"
          @edit-click="onEdit"
        )
  router-view

</template>
<script setup lang="ts">

import PageTitle from '@/components/PageTitle.vue'
import SearchInput from '@/lib/SearchInput.vue'
import { useSearch } from '@/services/util'
import { useUsers } from '@/services/administrating'
import Resize from '@/lib/StmResize.vue'
import UserTable from '@/components/users/UserTable.vue'
import { useRouteParams } from '@/lib/updateRouteParams'

const { search } = useSearch()
const { users, currentUserId } = useUsers({ search })
const { router } = useRouteParams()

const props = defineProps<{
  rootState: string
  editRoute: string
  createRoute: string
  model: any
}>()

function onEdit(user: { id: string }) {
  const query: Record<string, any> = {}
  if (search.value) {
    query.search = search.value
  }
  router.push({
    name: props.editRoute,
    params: { userId: user.id },
    query,
  })
}

</script>
