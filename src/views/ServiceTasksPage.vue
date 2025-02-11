<template lang="pug">
.service-tasks-page
  page-title(:title="`menu.${rootState}`")
  el-container
    el-main
      .filters
        search-input(v-model="search")
        .date-picker
          el-date-picker(
            v-model="dateRange"
            type="daterange"
            :unlink-panels="true"
          )
        .buttons
          site-select(
            v-model="siteId"
            auto-select
          )
          tool-button(
            tool="add"
            @click="onAdd()"
          )
      resize#stock-operation-scroll(
        :padding="40"
      )
        template(#default="{ resized }")
          el-auto-resizer
            template(#default="{ width }")
              service-task-table(
                :height="resized"
                :service-tasks="serviceTasks"
                :width="width"
                @edit-click="onEdit"
                @show-history-click="t => onEdit(t, 'history')"
              )
  router-view

</template>

<script setup lang="ts">

import { ref } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import SearchInput from '@/lib/SearchInput.vue'
import Resize from '@/lib/StmResize.vue'
import { useRouteParams } from '@/lib/updateRouteParams'
import { useDateRange, useSearch } from '@/services/util'
import ToolButton from '@/lib/ToolButton.vue'
import SiteSelect from '@/components/select/SiteSelect.vue'
import ServiceTaskTable from '@/components/tasks/ServiceTaskTable.vue'
import { useTasking } from '@/services/serving'

const props = defineProps<{
  rootState: string
  editRoute: string
  createRoute: string
  model: any
}>()

const siteId = ref('')

const { dateRange } = useDateRange()
const { search } = useSearch()
const { router } = useRouteParams()
const { serviceTasks } = useTasking({ dateRange, siteId, search })

function onAdd() {
  const { value } = siteId
  if (!value) {
    return
  }
  router.push({
    name: props.createRoute,
    query: { siteId: value },
  })
}

function onEdit(serviceTask: { id: string }, tab?: string) {
  const query = { tab }
  if (!tab) {
    delete query.tab
  }
  router.push({
    name: props.editRoute,
    params: { serviceTaskId: serviceTask.id },
    query,
  })
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.filters {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: $padding;
}
</style>
