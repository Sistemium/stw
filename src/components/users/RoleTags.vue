<template lang="pug">
.role-tags
  el-tag(
    v-for="tag in tags"
    :key="tag"
  ) {{ $t(`roles.${tag}`) }}
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  roles?: Record<string, any>
}>()
const tags = computed<string[]>(() => {
  const keys = Object.keys(props.roles || {})
  return keys.filter(key => key === 'admin' && props.roles[key])
})
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
