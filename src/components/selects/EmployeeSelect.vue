<template lang="pug">
v-autocomplete.category-select(
  :label="$t('fields.employee')"
  :items="options"
  :model-value="modelId"
  @update:model-value="id => { modelId = id || null }"
  item-title="name"
  item-value="id"
  :rules="rules"
)
//:placeholder="$t('actions.select', [$t('accusative.employee')])"
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { orderByName } from '@/services/util'
import Employee from '@/models/Employee'
import { useRequiredProp } from '@/services/validation'

const props = defineProps<{
  siteId?: string
  required?: boolean
}>()

const options = computed(() => {
  const filter = { siteId: props.siteId }
  if (props.siteId === '*') {
    delete filter.siteId
  }
  const employees = Employee.reactiveFilter(filter)
  return orderByName(employees)
})
const modelId = defineModel<string>()
const rules = useRequiredProp(props, 'fields.employee')
</script>

<style scoped lang="scss">
//.employee-select {
//  width: 200px;
//}
</style>
