<template lang="pug">
// eslint-disable vue/no-mutating-props
.service-task-form
  el-form(
    ref="form"
    :model="model"
    :rules="rules"
  )
    el-form-item(
      :label="$t('fields.date')"
      prop="date"
    )
      date-string-picker(v-model="model.date")
    el-form-item(
      :label="$t('fields.description')"
      prop="description"
    )
      el-input(
        v-model="model.description"
        type="textarea"
        :autosize="{ minRows: 2 }"
      )
    el-form-item(
      :label="$t('fields.processing')"
      prop="processing"
    )
      workflow-button(
        v-model="model.processing"
        :workflow="serviceTaskWorkflow"
      )
    el-form-item(
      :label="$t('fields.assignee')"
      prop="assigneeId"
    )
      employee-select(
        :site-id="model.siteId"
        v-model="model.assigneeId"
      )
</template>

<script setup lang="ts">
import { useFormValidate } from '@/services/validating'
import { $requiredRule } from '@/lib/validations'
import { computed } from 'vue'
import { type IServiceTask, serviceTaskWorkflow } from '@/models/ServiceTask'
import DateStringPicker from '@/lib/DateStringPicker.vue'
import EmployeeSelect from '@/components/select/EmployeeSelect.vue'
import WorkflowButton from '@/lib/WorkflowButton.vue'

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
