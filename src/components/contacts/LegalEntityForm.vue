<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.legal-entity-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(:label="$t('fields.name')" prop="name")
    el-input(v-model="model.name")

  el-form-item(:label="$t('fields.regCode')" prop="code")
    el-input(v-model="model.code")

  el-form-item(:label="$t('fields.vatCode')" prop="vatCode")
    el-input(v-model="model.vatCode")

  el-form-item(:label="$t('fields.address')" prop="address")
    el-input(v-model="model.address")

</template>
<script setup lang="ts">

import { computed } from 'vue';
import { $requiredRule } from '@/lib/validations';
import type { LegalEntity } from '@/models/LegalEntities';
import { useFormValidate } from '@/services/validating';

defineProps<{
  model: LegalEntity;
  disabled?: boolean;
}>();

const { form, validate } = useFormValidate();

defineExpose({ validate });

const rules = computed(() => $requiredRule(['name']));

</script>
