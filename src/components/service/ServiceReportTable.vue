<template lang="pug">

el-table.service-report-table(
  :key="width"
  :height="height"
  :width="width"
  :data="rows"
  :span-method="spanMethod"
  border
)
  el-table-column(
    prop="customerName"
    :label="$t('fields.customer')"
  )
    template(#default="{ row }")
      .name {{ row.customerName }}
      .address
        small.text-grey {{ row.address }}
  el-table-column(
    prop="date"
    :label="$t('fields.date')"
  )
    template(#default="{ row }")
      span {{ $d(row.date) }}
  el-table-column(
    prop="type"
    :label="$t('fields.type')"
  )
    template(#default="{ row }")
      .type {{ safeT(row.type, 'serviceType') }}
      .service-type(v-if="row.serviceType" )
        small ({{ safeT(row.serviceType, 'serviceType') }})
  el-table-column(
    prop="description"
    :label="$t('fields.description')"
  )
  el-table-column(
    prop="filterSystemName"
    :label="$t('fields.filterSystem')"
  )
  el-table-column(
    :label="$t('fields.service')"
  )
    template(#default="{ row }")
      .services(v-if="row.services")
        .d-flex(v-for="service in row.services" :key="service.articleId")
          .name {{ Article.reactiveGet(service.articleId)?.name }}
          .price {{ service.price }} &euro;
  template(#empty)
    alert-empty
</template>

<script setup lang="tsx">

import { computed } from 'vue'
import AlertEmpty from '@/lib/AlertEmpty.vue'
import type { ServiceReportItem } from '@/services/serving'
import flatten from 'lodash/flatten'
import orderBy from 'lodash/orderBy'
import { safeT } from '@/services/i18n'
import Article from '../../models/Article'

const props = withDefaults(defineProps<{
  items: ServiceReportItem[]
  height?: number
  width?: number
  columnWidth?: number
  activeId?: string
}>(), {
  columnWidth: 70,
  width: 0,
})

const rows = computed(() => {
  const sorted = orderBy(props.items, 'date') as ServiceReportItem[]
  const grouped = sorted.map(point => [
    ...point.events.map((e, eventIndex) => ({
      eventIndex,
      ...point,
      ...e,
    })),
  ])
  return flatten(grouped)
})


function spanMethod(cell: { row: any, column: any, rowIndex: number, columnIndex: number }) {
  if (!cell.row.eventIndex) {
    if (!cell.columnIndex) {
      return [cell.row.events.length, 1]
    }
  }
  if (!cell.columnIndex) {
    return [0, 0]
  }
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

small {
  color: $gray;
}

.service-report-table::v-deep(.description > div) {
  white-space: normal;
  text-align: left;
  //font-size: small;
}

.service-report-table::v-deep(.text-left) {
  max-width: 100%;
  overflow: hidden;

  * {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.alert-empty {
  margin-top: 20px;
}

.d-flex {
  justify-content: space-between;
}
</style>
