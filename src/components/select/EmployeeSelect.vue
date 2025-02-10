<template lang="pug">
el-select.employee-select(
  :model-value="modelId"
  :clearable="true"
  :placeholder="$t('actions.select', [$t('accusative.employee')])"
  @update:model-value="id => { modelId = id || null }"
)
  el-option(
    v-for="o in options"
    :key="o.id"
    :value="o.id"
    :label="o.name"
  )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { orderByName } from '@/services/util'
import Employee from '@/models/Employee'

const props = defineProps<{
  siteId?: string
}>()

const options = computed(() => orderByName(Employee.reactiveFilter({ siteId: props.siteId })))
const modelId = defineModel<string>()

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.employee-select {
  width: 200px;
}
</style>
