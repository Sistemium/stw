<template lang="pug">
.service-report-page

  page-title(title="menu.serviceReport")

  .filters
    employee-select(v-model="employeeId" site-id="*")
    el-date-picker.ml-1(
      v-model="dateRange"
      type="daterange"
      :unlink-panels="true"
    )

  stm-resize.my-3(
    :padding="30"
  )
    template(#default="{ resized }")
      el-auto-resizer
        template(#default="{ width }")
          service-report-table(
            :height="resized"
            :width="width"
            :items="data"
          )
</template>

<script setup lang="ts">

import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { useRouteQuery } from '@/services/util'
import { useDateRange } from '@/services/timing'
import EmployeeSelect from '@/components/select/EmployeeSelect.vue'
import PageTitle from '@/components/PageTitle.vue'
import StmResize from '@/lib/StmResize.vue'
import ServiceReport from '@/models/reports/ServiceReport'
import ServiceReportTable from '@/components/service/ServiceReportTable.vue'
import type { ServiceReportItem } from '@/services/serving'
import matchesDeep from 'sistemium-data/lib/util/matchesDeep.js'

const data = ref<ServiceReportItem[]>([])
const { search: employeeId } = useRouteQuery('employeeId')
const { dateRange } = useDateRange({
  dateE: dayjs().endOf('month').toDate(),
  dateB: dayjs().startOf('month').toDate(),
})

const queryParams = computed(() => {
  const [dateB, dateE] = dateRange.value
  return {
    dateB: dayjs(dateB).startOf('day').format('YYYY-MM-DD'),
    dateE: dayjs(dateE).endOf('day').format('YYYY-MM-DD'),
    employeeId: employeeId.value,
  }
})

watch(queryParams, async (p, oldValue) => {
  if (matchesDeep(p, oldValue)) {
    return
  }
  if (p.dateB && p.dateE && p.employeeId) {
    data.value = await ServiceReport.findAll(p, { cacheResponse: false })
  }
}, { immediate: true, deep: true })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
