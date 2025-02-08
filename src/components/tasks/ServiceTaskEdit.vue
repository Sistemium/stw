<template lang="pug">
drawer-edit.service-task-edit(
  :title="$tGen('editing', 'serviceTask')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :validate-fn="formRef?.validate"
)
  template(#default="{ model }")
    service-task-form(
      ref="formRef"
      :model="model"
    )
</template>

<script setup lang="ts">

import { todayStringDate } from '@/services/util'
import { computed } from 'vue'
import DrawerEdit from '@/lib/DrawerEdit.vue'
import ServiceTaskForm from '@/components/tasks/ServiceTaskForm.vue'
import { useDrawerEditing } from '@/services/drawerEditing'
import { useFormValidate } from '@/services/validating'
import ServiceTask, { type IServiceTask } from '@/models/ServiceTask'
import { useRouteParams } from '@/lib/updateRouteParams'


const props = defineProps<{
  serviceTaskId?: string
  from: Record<string, any>
  drawerStyle?: Record<string, any>
}>()

const { saveFn, destroyFn } = useDrawerEditing(ServiceTask)
const { route } = useRouteParams()
const modelOrigin = computed<Partial<IServiceTask>>(() => props.serviceTaskId ? ServiceTask.reactiveGet(props.serviceTaskId) : {
  description: '',
  date: todayStringDate(),
  siteId: route.query.siteId,
})

const { form: formRef } = useFormValidate()

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
