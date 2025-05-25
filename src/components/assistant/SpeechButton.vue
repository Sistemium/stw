<template lang="pug">
v-btn.speech-button(
  v-if="isSupported"
  @click="toggle"
  :disabled="busy || false"
  density="comfortable"
  :color="isListening ? 'warning' : ''"
  variant="tonal"
  circle
  :icon="isListening ? '$mdiMicrophoneOff' : '$mdiMicrophone'"
)
</template>

<script setup lang="ts">
import { useSpeechRecognition } from '@vueuse/core'
import { watch } from 'vue'
import { getLocale } from '@/services/i18n'


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
