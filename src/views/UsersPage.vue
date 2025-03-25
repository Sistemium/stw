<template lang="pug">
.users-page.page
  page-title(title="menu.users")
  el-container
    el-main
      .filters
        search-input(v-model="search")
      resize(
        :padding="40"
      )
        template(#default="{ resized }")
          el-auto-resizer
            template(#default="{ width }")
              user-table(
                :users="users"
                :height="resized"
                :width="width"
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
