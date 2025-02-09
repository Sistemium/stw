<template lang="pug">
// eslint-disable vue/no-mutating-props
.service-task-form
  el-form-item(
    :label="$t('fields.processing')"
  )
    workflow-processing(
      :processing="model.processing"
      :workflow="serviceTaskWorkflow"
    )
      workflow-transitions(:workflow="serviceTaskWorkflow" v-model="model.processing")
  el-form(
    ref="form"
    :model="model"
    :rules="rules"
    :disabled
  )
    el-form-item(
      :label="$t('fields.date')"
      prop="date"
    )
      date-string-picker(v-model="model.date")
    el-form-item(
      :label="$t('fields.customer')"
      prop="servicePointId"
    )
      service-point-select(
        v-model="model.servicePointId"
        :site-id="model.siteId"
      )
    el-form-item.description(
      :label="$t('fields.description')"
      prop="description"
    )
      el-input(
        v-model="model.description"
        type="textarea"
        :autosize="{ minRows: 2 }"
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
import ServicePointSelect from '@/components/select/ServicePointSelect.vue'
import WorkflowTransitions from '@/lib/WorkflowTransitions.vue'
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue'

const { form, validate } = useFormValidate();

defineExpose({ validate });

const props = defineProps<{
  model: IServiceTask
}>();

const rules = computed(() => $requiredRule(['date', 'description']));
const disabled = computed(() => !serviceTaskWorkflow.step(props.model.processing)?.editable)

</script>
<style scoped>
.description {
  flex-direction: column;
  &::v-deep(label) {
    align-self: start;
  }
}
.workflow-transitions {
  display: inline-block;
  margin-left: 1em;
}
</style>
