<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.storage-form(
  ref="form"
  :model="model"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(
    :label="$t('fields.type')"
    prop="type"
  )
    el-radio-group(v-model="model.type")
      el-radio-button(label="facility") {{ $t('concepts.facility') }}
      el-radio-button(label="personal") {{ $t('concepts.personal') }}

  el-form-item(
    :label="$t('fields.name')"
    prop="name"
  )
    el-input(v-model="model.name")

  el-form-item(
    :label="$t('fields.site')"
    prop="siteId"
  )
    site-select(
      v-if="hasSiteAccess"
      v-model="model.siteId"
    )
    .blink.px-1(v-else) {{ $t('validation.otherSite') }}

  el-form-item(
    :label="$t('fields.employee')"
    prop="employeeId"
    v-if="model.type === 'personal'"
  )
    employee-select(
      v-if="hasSiteAccess"
      v-model="model.employeeId"
    )
    .blink.px-1(v-else) {{ $t('validation.otherSite') }}

  el-form-item(
    :label="$t('fields.email')"
    prop="email"
  )
    el-input(v-model="model.email")

</template>
<script setup lang="ts">
import { computed } from 'vue'
import { $requiredRule } from '@/lib/validations'
import { hasSiteAuth, useFormValidate } from '@/services/validating'
import SiteSelect from '@/components/select/SiteSelect.vue'
import type { BaseItem } from '@/init/Model'
import EmployeeSelect from '@/components/select/EmployeeSelect.vue'

const props = defineProps<{
  model: BaseItem,
  disabled: boolean,
}>()

const { form, validate } = useFormValidate()

defineExpose({ validate })

const rules = computed(() => $requiredRule('name'))
const hasSiteAccess = computed(() => !props.model?.siteId || hasSiteAuth(props.model.siteId))

</script>
