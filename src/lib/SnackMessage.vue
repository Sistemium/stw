<template lang="pug">
v-snackbar(
  v-model="visible"
  :color
) {{ model }}
  template(#actions)
    v-btn(
      @click="() => { visible = false }"
      icon="$mdiClose"
    )
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { color = 'error' } = defineProps<{
  color?: string
}>()

const model = defineModel({ default: '' })
const visible = computed<boolean>(({
  get() {
    return !!model.value
  },
  set(value: boolean) {
    if (!value) {
      model.value = ''
    }
  }
}))
</script>
