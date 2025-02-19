<template lang="pug">
el-collapse(
  v-model="isCollapsed"
  v-if="modelValue"
)
  el-collapse-item(
    :title="`${label}: ${modelValue.name}`"
    name="creator"
  )
    el-input(
      readonly
      v-if="modelValue.email"
      :model-value="modelValue.email"
    )
    el-input(
      readonly
      v-if="modelValue.phone"
      :model-value="modelValue.phone"
    )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IUser } from '@/models/User'

const isCollapsed = ref()
defineProps<{
  modelValue?: IUser
  label: string
}>()
</script>

<style scoped lang="scss">
@import "@/styles/variables";
.el-collapse,
.el-collapse::v-deep(.el-collapse-item__header),
.el-collapse::v-deep(.el-collapse-item__wrap) {
  border-top: none;
  border-bottom: none;
}

.el-input + .el-input {
  margin-top: $padding;
}
</style>
