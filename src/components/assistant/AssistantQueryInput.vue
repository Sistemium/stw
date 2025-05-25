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
      v-chip(
        v-for="item in context"
        :key="item.id"
        closable
        size="small"
        @click:close="emit('removeContext', item.id)"
      ) {{ item.label }}
</template>

<script setup lang="ts">

import { ref } from 'vue'
import SpeechButton from '@/components/assistant/SpeechButton.vue'

defineProps<{
  disabled?: boolean
  context?: { id: string, label: string }[]
}>()

const emit = defineEmits<{
  (e: 'query', query: string): void
  (e: 'removeContext', id: string): void
}>()
const query = ref('')

function emitSearch() {
  emit('query', query.value)
  query.value = ''
}

function onSpoken(text: string) {
  query.value = text
}
</script>
