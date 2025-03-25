<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form(
  ref="form"
  :model="model"
  :rules="rules"
)
  el-form-item(
    :label="$t('fields.firstName')"
    prop="name"
  )
    el-input(v-model="model.name")
  el-form-item(
    :label="$t('fields.phone')"
    prop="phone"
  )
    el-input(v-model="model.phone")
  el-form-item(
    :label="$t('fields.email')"
    prop="email"
  )
    el-input(v-model="model.email")

</template>

<script setup lang="ts">
import { useFormValidate } from '@/services/validating'
import { computed } from 'vue'
import { $requiredRule } from '@/lib/validations'
import type { IUser } from '@/models/User'

const { form, validate } = useFormValidate()
const rules = computed(() => $requiredRule('name'))
defineProps<{
  model: Partial<IUser>
}>()

defineExpose({ validate })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
