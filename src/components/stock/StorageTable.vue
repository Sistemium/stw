<template lang="pug">
v-data-table-virtual.storage-table(
  :headers="columns"
  :items="storages"
  :height="height"
  fixed-header
  :row-props="rowProps"
  density="comfortable"
)
  template(#item.siteId="{ value }")
    | {{ Site.reactiveGet(value)?.name }}
  template(#item.type="{ value }")
    | {{ $t(`concepts.${value}`) }}
  template(#item.employeeId="{ value }")
    | {{ Employee.reactiveGet(value)?.name }}
  template(#item.buttons="{ item }")
    tool-button(
      tool="edit"
      :circle="false"
      @click="() => emit('editClick', item)"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Site from '@/models/Site'
import Employee from '@/models/Employee'
import { t } from '@/lib/validations'
import ToolButton from '@/lib/ToolButton.vue'
import { useRowProps } from '@/services/util'
import type { IStorage } from '@/models/Storage'

const props = defineProps<{
  storages: IStorage[]
  height?: number
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'editClick', row: IStorage): void
}>()

const rowProps = useRowProps(props)

const columns = computed(() => [
  {
    align: 'left',
    title: t('fields.name'),
    key: 'name',
  },
  {
    align: 'left',
    title: t('fields.site'),
    key: 'siteId',
  },
  {
    align: 'left',
    title: t('fields.email'),
    key: 'email',
  },
  {
    align: 'left',
    title: t('fields.type'),
    key: 'type',
  },
  {
    align: 'left',
    title: t('fields.employee'),
    key: 'employeeId',
  },
  {
    key: 'buttons',
    width: 60,
    align: 'right',
  },
])

</script>
