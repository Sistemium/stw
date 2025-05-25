<template lang="pug">
// eslint-disable vue/no-mutating-props
.service-task-form

  el-form-item
    template(#label)
      workflow-processing(
        :processing="model.processing"
        :workflow="serviceTaskWorkflow"
      )
    .processing
      workflow-transitions(:workflow="serviceTaskWorkflow" v-model="model.processing")
  el-form(
    ref="form"
    :model="model"
    :rules="rules"
    :disabled
  )
    slot
    el-form-item(
      :label="$t('fields.site')"
      prop="siteId"
    )
      site-select(v-model="model.siteId" )
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
    el-form-item(
      v-if="address"
      :label="$t('fields.address')"
    )
      el-input(
        disabled
        type="textarea"
        :model-value="address"
      )
    service-list-input(
      v-if="model.services"
      v-model="model.services"
      :date="model.date"
      :site-id="model.siteId"
      :employee-id="model.assigneeId"
      ref="servicesForm"
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
import { type FormValidateCallback, useFormValidate } from '@/services/validating'
import { $requiredRule } from '@/lib/validations'
import { computed, watch } from 'vue'
import { type IServiceTask, serviceTaskWorkflow } from '@/models/ServiceTask'
import DateStringPicker from '@/lib/DateStringPicker.vue'
import EmployeeSelect from '@/components/select/EmployeeSelect.vue'
import ServicePointSelect from '@/components/select/ServicePointSelect.vue'
import WorkflowTransitions from '@/lib/WorkflowTransitions.vue'
import WorkflowProcessing from '@/lib/WorkflowProcessing.vue'
import ServicePointCustomer from '@/models/ServicePointCustomer'
import SiteSelect from '@/components/select/SiteSelect.vue'
import { fetchServiceTask } from '@/services/dataSync'
import ServiceListInput from '@/components/tasks/ServiceListInput.vue'

const { form, validate } = useFormValidate()
const { form: servicesForm, validate: servicesFormValidate } = useFormValidate()

defineExpose({
  validate(cb: FormValidateCallback) {
    return validate(res => {
      if (!res || !servicesForm.value) {
        cb(res)
      } else {
        servicesFormValidate(cb)
      }
    })
  },
})

const props = defineProps<{
  model: IServiceTask
  modelOrigin?: IServiceTask
}>()

const address = computed(() => ServicePointCustomer.reactiveGet(props.model.servicePointId)?.address)

const rules = computed(() => {
  const required = ['date', 'siteId']
  if (!['draft', 'rejected', 'cancelled'].includes(props.model.processing)) {
    required.push('assigneeId')
  }
  if (!props.model.services?.find(({ articleId }) => !!articleId)) {
    required.push('description')
  }
  return $requiredRule(required)
})
const disabled = computed(() => !serviceTaskWorkflow.step(props.modelOrigin?.processing)?.editable)

watch(() => props.model?.id, serviceTaskId => {
  serviceTaskId && fetchServiceTask(serviceTaskId)
    .then()
}, { immediate: true })

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

.processing {
  width: 100%;
  text-align: right;
}

.el-form::v-deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: var(--el-text-color-regular);
}
</style>
