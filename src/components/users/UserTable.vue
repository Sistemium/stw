<template lang="pug">
v-data-table-virtual.user-table(
  :headers="columns"
  :items="users"
  :height="height"
  fixed-header
  :row-props="rowProps"
  density="comfortable"
)
  template(#item.roles="{ value }")
    role-tags(:roles="value")
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
import type { IUser } from '@/models/User'
import Employee from '@/models/Employee'
import { t } from '@/lib/validations'
import ToolButton from '@/lib/ToolButton.vue'
import RoleTags from '@/components/users/RoleTags.vue'
import { useRowProps } from '@/services/util'

const props = defineProps<{
  users: IUser[]
  height?: number
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'editClick', row: IUser): void
}>()

const rowProps = useRowProps(props)

const columns = computed(() => [
  {
    align: 'left',
    title: t('fields.firstName'),
    key: 'name',
  },
  {
    align: 'left',
    title: t('fields.email'),
    key: 'email',
  },
  {
    align: 'left',
    title: t('fields.phone'),
    key: 'phone',
  },
  {
    align: 'left',
    title: t('fields.employee'),
    key: 'employeeId',
  },
  {
    align: 'left',
    title: t('fields.roles'),
    key: 'roles',
  },
  {
    key: 'buttons',
    width: 60,
    align: 'right',
  },
])

</script>
