<template lang="pug">
.assistant-query-input.d-flex.align-center
  speech-button(
    :busy="disabled"
    @spoken="onSpoken"
  )
  el-input.ml-2(
    v-model="query"
    :disabled="disabled"
    type="textarea"
    :autosize="{ minRows: 2 }"
    :placeholder="disabled ? $t('loading') : $t('fields.prompt')"
    @keyup.enter="emitSearch"
  )
  el-button.ml-2(
    type="primary"
    :disabled="disabled || !query"
    @click="emitSearch"
  ) {{ $t('actions.send') }}
</template>

<script setup lang="ts">

import { ref } from 'vue'
import SpeechButton from '@/components/assistant/SpeechButton.vue'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'query', query: string): void
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
