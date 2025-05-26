<template lang="pug">
v-list(v-if="prompt.results" density="compact")
  v-list-item
    v-list-subheader
      v-icon $mdiMessageOutline
      span.ml-3 {{ prompt.query }}
    template(#append)
      v-btn(
        variant="flat"
        icon="$mdiClose"
        density="compact"
        size="small"
        @click="emit('close')"
      )
  v-list-item(
    v-if="!prompt.results.length"
    :title="$t('validation.noData')"
  )
  v-list-item(
    v-for="result in fullResults"
    :key="result.id"
    :title="result.name"
    :subtitle="safeT(result.entityType, 'fields')"
  )
    template(#append)
      v-btn(
        type="success"
        size="small"
        density="comfortable"
        variant="tonal"
        :color="result.selected ? 'success' : ''"
        @click="toggleItem(result.id)"
      ) {{ result.selected ? $t('remove') : $t('add') }}
        template(#prepend)
          v-icon(v-if="result.selected" size="large") $mdiCheck
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PromptData } from '@/services/prompting'
import { safeT } from '@/services/i18n'

const selected = defineModel({ default: [] })

const props = defineProps<{
  prompt: PromptData
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const fullResults = computed(() => props.prompt.results.map(res => ({
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
