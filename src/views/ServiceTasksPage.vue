<template lang="pug">
.service-tasks-page
  page-title(:title="`menu.${rootState}`")
    tool-button(
      tool="refresh"
      @click="refresh"
    )
  el-container
    el-main
      .filters
        search-input(v-model="search")
          //template(#append)
        workflow-filter(v-model="statuses" :workflow="serviceTaskWorkflow")
        .date-picker
          el-date-picker(
            v-model="dateRange"
            type="daterange"
            :unlink-panels="true"
            :value-on-clear="resetDates"
          )
        .buttons
          site-select(
            v-model="siteId"
            auto-select
          )
          tool-button(
            tool="add"
            @click="onAdd()"
            :disabled="!siteId"
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

import { ref, watch } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import SearchInput from '@/lib/SearchInput.vue'
import Resize from '@/lib/StmResize.vue'
import { useRouteParams } from '@/lib/updateRouteParams'
import { useSearch } from '@/services/util'
import ToolButton from '@/lib/ToolButton.vue'
import SiteSelect from '@/components/select/SiteSelect.vue'
import ServiceTaskTable from '@/components/tasks/ServiceTaskTable.vue'
import { useTasking } from '@/services/serving'
import { useInvStore } from '@/store/invStore'
import { serviceTaskWorkflow } from '@/models/ServiceTask'
import WorkflowFilter from '@/lib/WorkflowFilter.vue'
import { useDateRange } from '@/services/timing'

const props = defineProps<{
  rootState: string
  editRoute: string
  createRoute: string
  model: any
}>()

const statuses = ref(serviceTaskWorkflow.allActive())
const store = useInvStore()
const siteId = ref(store.currentSiteId)
const { dateRange, resetDates } = useDateRange()
const { search } = useSearch()
const { router } = useRouteParams()
const { serviceTasks, refresh } = useTasking({ dateRange, siteId, search, statuses })

watch(siteId, id => {
  if (id) {
    store.currentSiteId = id
  }
})

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

.workflow-filter {
  min-width: 170px;
  max-width: 190px;
}

.tool-button {
  margin-left: $margin-right;
}
</style>
