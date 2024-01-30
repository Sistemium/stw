<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.storage-form(
  ref="form"
  :model="model"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(
    :label="$t('fields.name')"
    prop="name"
  )
    el-input(v-model="model.name")

  el-form-item(
    :label="$t('fields.withVat')"
  )
    el-switch(v-model="model.vatPrices")

</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IPricing } from '@/models/Pricing'
import { $requiredRule } from '@/lib/validations'

defineProps<{
  model: Partial<IPricing>
  disabled?: boolean
}>()

const rules = computed(() => $requiredRule(['name']));

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
