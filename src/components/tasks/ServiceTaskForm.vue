<template lang="pug">
// eslint-disable vue/no-mutating-props
.service-task-form
  el-form(
    ref="form"
    :model="model"
    :rules="rules"
  )
    el-form-item(
      :label="$t('fields.description')"
      prop="description"
    )
      el-input(v-model="model.description")
</template>

<script setup lang="ts">
import { useFormValidate } from '@/services/validating'
import { $requiredRule } from '@/lib/validations'
import { computed } from 'vue'
import type { IServiceTask } from '@/models/ServiceTask'

const { form, validate } = useFormValidate();

defineExpose({ validate });

defineProps<{
  model: IServiceTask
}>();

const rules = computed(() => $requiredRule(['date', 'description']));


</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
