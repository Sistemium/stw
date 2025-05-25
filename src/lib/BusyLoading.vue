<template lang="pug">
v-overlay.align-center.justify-center(
  :model-value="busy"
  contained
  :close-on-content-click="false"
  persistent
)
  v-progress-circular(
    color="primary"
    indeterminate
    :size
  )
</template>

<script setup lang="ts">
const { size = 64 } = defineProps<{
  busy: boolean
  size?: number
}>()
</script>
