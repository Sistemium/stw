<template lang="pug">
.assistant-query-input.d-flex
  el-input(
    v-model="query"
    :disabled="disabled"
    type="textarea"
    :autosize="{ minRows: 2 }"
    :placeholder="$t('fields.prompt')"
    @keyup.ctrl.enter="emitSearch"
  )
  el-button.ml-2(
    type="primary"
    :disabled="disabled || !query"
    @click="emitSearch"
  ) {{ $t('actions.send') }}
</template>

<script setup lang="ts">

import { ref } from 'vue'

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
</script>
