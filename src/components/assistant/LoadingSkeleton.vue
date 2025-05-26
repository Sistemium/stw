<template lang="pug">
v-list(
  border
  v-if="loading"
)
  v-list-subheader
    v-icon $mdiMessageProcessingOutline
    span.ml-3 {{ loading }}
  v-skeleton-loader.ma-2(type="paragraph")
</template>

<script setup lang="ts">
defineProps<{
  loading: string
}>()
</script>
