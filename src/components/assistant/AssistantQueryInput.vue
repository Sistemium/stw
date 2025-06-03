<template lang="pug">
.assistant-query-input.d-flex.align-center
  v-textarea(
    v-model="query"
    :disabled="disabled || false"
    :rows="1"
    clearable
    variant="outlined"
    auto-grow
    :placeholder="disabled ? $t('loading') : $t('fields.prompt')"
    @keydown.enter.exact.prevent="emitSearch"
    hide-details
  )
    template(#prepend)
      speech-button(
        :busy="disabled"
        @spoken="onSpoken"
      )
    template(#append-inner)
      v-btn(
        variant="flat"
        color="primary"
        :disabled="disabled || !query"
        @click="emitSearch"
      ) {{ $t('actions.send') }}
    template(#prepend-inner v-if="context")
      context-chips(
        :context="context"
        @click:close="id => emit('removeContext', id)"
      )
</template>

<script setup lang="ts">

import SpeechButton from '@/components/assistant/SpeechButton.vue'
import ContextChips from '@/components/assistant/ContextChips.vue'

defineProps<{
  disabled?: boolean
  context?: { id: string, label: string }[]
}>()

const emit = defineEmits<{
  (e: 'query', query: string): void
  (e: 'removeContext', id: string): void
}>()
const query = defineModel({ default: '' })

function emitSearch() {
  emit('query', query.value)
  query.value = ''
}

function onSpoken(text: string) {
  query.value = text
}
</script>
<style scoped lang="scss">
.v-chip + .v-chip {
  margin-left: 4px;
}
</style>
