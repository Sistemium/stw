<template lang="pug">
.list-group(v-if="results")
  el-alert(
    v-if="!results.length"
    :title="$t('validation.noData')"
    @close="emit('close')"
  )
  .list-group-item.d-flex.align-center(
    v-for="result in fullResults"
    :key="result.id"
  )
    strong {{ safeT(result.entityType, 'fields') }}
    .ml-2.flex-1.text-left
      span {{ result.name }}
    el-icon(v-if="result.selected" size="large")
      Check
    el-button(
      type="success"
      size="small"
      text
      bg
      @click="toggleItem(result.id)"
    ) {{ result.selected ? $t('remove') : $t('add') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SearchResult } from '@/services/prompting'
import { safeT } from '@/i18n'
import { Check } from '@element-plus/icons-vue'

const selected = defineModel({ default: [] })

const props = defineProps<{
  results: SearchResult[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const fullResults = computed(() => props.results.map(res => ({
  ...res,
  selected: selected.value.includes(res.id),
})))

function toggleItem(id: string) {
  const idx = selected.value.indexOf(id)
  if (idx === -1) {
    selected.value.push(id)
  } else {
    selected.value.splice(idx, 1)
  }
}
</script>
<style scoped>
.list-group-item.d-flex {
  cursor: default;
}
.el-button {
  width: 75px;
}
</style>
