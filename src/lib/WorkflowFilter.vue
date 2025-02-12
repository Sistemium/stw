<template lang="pug">
el-select.workflow-filter(
  v-model="selected"
  multiple
  collapse-tags
  :placeholder="tAction('select', 'statuses')"
  popper-class="custom-header"
)
  template(#header)
    el-checkbox(v-model="setActive") {{ $t('menu.active') }}
    el-checkbox(v-model="setInactive" ) {{ $t('menu.inactive') }}
  el-option-group(
    v-for="group in options"
    :key="group.label"
    :label="$t(group.label)"
  )
    el-option(
      v-for="item in group.options"
      :key="item.processing"
      :label="$t(item.label)"
      :value="item.processing"
    )
</template>

<script setup lang="ts">
import Workflow from '@/lib/Workflow'
import { computed, type Ref } from 'vue'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import { isEqual } from 'lodash'
import { tAction } from '@/lib/validations'

const selected: Ref<string[]> = defineModel({ default: [] })
const setActive = computed(activeSelector(true))
const setInactive = computed(activeSelector(false))
const { workflow } = defineProps<{
  workflow: Workflow
}>()

const options = computed(() => {
  const grouped = groupBy(workflow.options, o => o.inactive ? 'inactive' : 'active')
  return map(grouped, (options, label) => ({
    label: `menu.${label}`,
    options,
  }))
})

function activeSelector(is: boolean) {
  return {
    get() {
      return isEqual(selected.value, workflow.allActive(is))
    },
    set(val) {
      if (val) {
        selected.value = workflow.allActive(is)
      } else {
        selected.value = []
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
