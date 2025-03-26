<template lang="pug">
el-table-v2.user-table(
  :key="width"
  v-if="width"
  :columns="columns"
  :data="users"
  :width="width"
  :height="height"
  :fixed="true"
  :estimated-row-height="35"
  :row-class="rowClass"
)
  template(#empty)
    alert-empty
</template>

<script setup lang="tsx">
import AlertEmpty from '@/lib/AlertEmpty.vue'
import type { ColumnInfo } from '@/services/util'
import type { IUser } from '@/models/User'
import { computed } from 'vue'
import max from 'lodash/max'
import { t } from '@/lib/validations'
import ToolButton from '@/lib/ToolButton.vue'
import Employee from '@/models/Employee'
import RoleTags from '@/components/users/RoleTags.vue'

const props = withDefaults(defineProps<{
  users: IUser[]
  height?: number
  width?: number
  columnWidth?: number
  activeId?: string
}>(), {
  columnWidth: 100,
  width: 0,
})


const emit = defineEmits<{
  (e: 'editClick', row: IUser): void
  (e: 'resize', columns: ColumnInfo[]): void
}>()

const rowClass = (row: { rowData: IUser }) => (row.rowData.id === props.activeId) ? 'active' : ''
const columns = computed(() => {
  const count = 4.5
  const { columnWidth } = props
  const nameWidth = max([props.width - columnWidth * count - 6 - 300, 300]) || 0
  const width = max([Math.floor((props.width - nameWidth - 6 - 60) / count), columnWidth]) || 0
  return [
    {
      width: nameWidth,
      align: 'left',
      title: t('fields.firstName'),
      dataKey: 'name',
    },
    {
      width: width * 1.5,
      align: 'left',
      title: t('fields.email'),
      dataKey: 'email',
    },
    {
      width,
      align: 'left',
      title: t('fields.phone'),
      dataKey: 'phone',
    },
    {
      width,
      align: 'left',
      title: t('fields.employee'),
      dataKey: 'masterId',
      cellRenderer: ({ cellData }) =>
        <span>{ Employee.reactiveGet(cellData)?.name }</span>
    },
    {
      width,
      align: 'left',
      title: t('fields.roles'),
      dataKey: 'roles',
      cellRenderer: ({ cellData }) =>
        <RoleTags roles={cellData}></RoleTags>
    },
    {
      key: 'buttons',
      width: 60,
      align: 'right',
      cellRenderer: ({ rowData }) =>
        <ToolButton
          tool="edit"
          circle={false}
          onClick={() => emit('editClick', rowData)}>
        </ToolButton>,
    },
  ]
})

</script>
<style lang="scss" scoped>

.user-table::v-deep(.el-table-v2__row) {
  min-height: 35px;
  &.active {
    background: lightcyan;
  }
}

.alert-empty {
  margin-top: 20px;
}
</style>
