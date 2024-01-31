<template lang="pug">
  el-select.site-select(
    :model-value="modelId"
    :clearable="!autoSelect"
    :placeholder="$t('actions.select', [$t('accusative.site')])"
    @update:model-value="id => { modelId = id }"
  )
    el-option(
      v-for="o in options"
      :key="o.id"
      :value="o.id"
      :label="o.name"
    )
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { orderByName } from '@/services/util'
import Site from '@/models/Site'

const options = computed(() => orderByName(Site.reactiveFilter()))
const modelId = defineModel<string>()

const props = defineProps<{
  autoSelect?: boolean
}>()

watch(options, o => {
  if (o.length === 1 && props.autoSelect) {
    modelId.value = o[0].id
  }
}, { immediate: true })

watch(() => props.autoSelect, autoSelect => {
  if (options.value.length === 1 && autoSelect) {
    modelId.value = options.value[0].id
  }
}, { immediate: true })


</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.site-select {
  width: 170px;
}
</style>
