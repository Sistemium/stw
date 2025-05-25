<template lang="pug">
// eslint-disable vue/no-mutating-props
v-form(
  ref="formRef"
  :model="model"
)
  v-text-field(
    :label="$t('fields.firstName')"
    v-model="model.name"
    :rules="[nameRequired]"
    :density
  )
  v-text-field(
    :label="$t('fields.phone')"
    v-model="model.phone"
    :density
  )
  v-text-field(
    :label="$t('fields.email')"
    v-model="model.email"
    :density
    :rules="[validEmail]"
  )
  employee-select(
    v-model="model.employeeId"
    site-id="*"
    :density
    clearable
  )
</template>

<script setup lang="ts">
import type { IUser } from '@/models/User'
import EmployeeSelect from '@/components/selects/EmployeeSelect.vue'
import { emailRule, requiredRule, useFormValidation } from '@/services/validation'
import type { VuetifyDensity } from '@/services/vuetify'

const { formRef, validate } = useFormValidation()
const nameRequired = requiredRule('fields.name')
const validEmail = emailRule('fields.email')
const density: VuetifyDensity = 'comfortable'

defineProps<{
  model: Partial<IUser>
}>()

defineExpose({ validate })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
