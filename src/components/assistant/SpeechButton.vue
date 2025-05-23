<template lang="pug">
.speech-button(v-if="isSupported")
  el-button(
    @click="toggle"
    :disabled="busy"
    :type="isListening ? 'warning' : 'success'"
    circle
    :icon="Microphone"
  )
</template>

<script setup lang="ts">
import { useSpeechRecognition } from '@vueuse/core'
import { watch } from 'vue'
import { getLocale } from '@/services/i18n'
import { Microphone } from '@element-plus/icons-vue'

const { lang = getLocale(), continuous = false } = defineProps<{
  continuous?: boolean
  lang?: string
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'spoken', text: string): void
}>()

const { isSupported, isListening, isFinal, result, start, stop } = useSpeechRecognition({
  lang,
  continuous,
})

function toggle() {
  if (isListening.value) {
    stop()
  } else {
    start()
  }
}

watch(isFinal, is => {
  if (is) {
    emit('spoken', result.value)
  }
})
</script>
