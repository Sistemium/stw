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
    el-tabs(v-model="currentTab")
      el-tab-pane(:label="$t('concepts.serviceTask')")
        service-task-form(
          ref="formRef"
          :model="model"
        )
      el-tab-pane(
        v-if="model.id"
        :label="$t('concepts.history')"
      )
        resize
          service-task-history-list(:service-task-id="model.id")
</template>

<script setup lang="ts">

import { todayStringDate } from '@/services/util'
import { computed, ref } from 'vue'
import DrawerEdit from '@/lib/DrawerEdit.vue'
import ServiceTaskForm from '@/components/tasks/ServiceTaskForm.vue'
import { useDrawerEditing } from '@/services/drawerEditing'
import { useFormValidate } from '@/services/validating'
import ServiceTask, { type IServiceTask } from '@/models/ServiceTask'
import { useRouteParams } from '@/lib/updateRouteParams'
import ServiceTaskHistoryList from '@/components/tasks/ServiceTaskHistoryList.vue'
import Resize from '@/lib/StmResize.vue';

const props = defineProps<{
  serviceTaskId?: string
  from: Record<string, any>
  drawerStyle?: Record<string, any>
}>()

const currentTab = ref<string>('0')
const { saveFn, destroyFn } = useDrawerEditing(ServiceTask)
const { route } = useRouteParams()
const modelOrigin = computed<Partial<IServiceTask>>(() =>
  props.serviceTaskId
  && ServiceTask.reactiveGet(props.serviceTaskId as string)
  || {
    description: '',
    date: todayStringDate(),
    siteId: route.query.siteId as string,
    processing: 'draft',
    assigneeId: undefined,
  })

const { form: formRef } = useFormValidate()

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
.service-task-history-list {
  //margin-top: 1em;
}
</style>
