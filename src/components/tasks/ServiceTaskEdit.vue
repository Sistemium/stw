<template lang="pug">
drawer-edit.service-task-edit(
  :title="$tGen('editing', 'serviceTask')"
  :save-fn="save"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :validate-fn="formRef?.validate"
)
  template(#default="{ model }")
    el-tabs(v-model="currentTab")
      el-tab-pane(
        :label="$t('concepts.serviceTask')"
        name="form"
      )
        service-task-form(
          ref="formRef"
          :model="model"
        )
          user-collapse(
            :model-value="modelOrigin?.creator"
            :label="$t('fields.creator')"
          )
      el-tab-pane(
        v-if="model.id"
        name="history"
        :label="$t('concepts.history')"
        v-loading="loading"
        lazy
      )
        .full-height
          resize(:padding="180")
            service-task-history-list(
              :service-task-id="model.id"
              @delete-comment="deleteComment"
            )
          el-form
            el-form-item()
              el-input(
                v-model="comment"
                type="textarea"
              )
            .float-right
              el-button(
                size="small"
                type="primary"
                @click="commentClick"
                :disabled="!comment"
              ) {{ $t('actions.comment') }}
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import DrawerEdit from '@/lib/DrawerEdit'
import ServiceTaskForm from '@/components/tasks/ServiceTaskForm'
import { useDrawerEditing } from '@/services/drawerEditing'
import { useFormValidate } from '@/services/validating'
import ServiceTask from '@/models/ServiceTask'
import type { HydratedServiceTask, ServiceTaskService } from '@/models/ServiceTask'
import { useRouteParams } from '@/lib/updateRouteParams'
import ServiceTaskHistoryList from '@/components/tasks/ServiceTaskHistoryList'
import Resize from '@/lib/StmResize'
import ServiceTaskHistory from '@/models/ServiceTaskHistory'
import UserCollapse from '@/components/contacts/UserCollapse.vue'
import { todayStringDate } from '@/services/timing'

const props = defineProps<{
  serviceTaskId?: string
  from: Record<string, any>
  drawerStyle?: Record<string, any>
}>()

interface ServiceTaskPartial extends Partial<HydratedServiceTask> {
  services: Partial<ServiceTaskService>[]
}

const comment = ref('')
const loading = ref()
const { route } = useRouteParams()
const currentTab = ref<string>(route.query.tab as string || 'form')
const { saveFn, destroyFn } = useDrawerEditing<HydratedServiceTask>(ServiceTask)
const modelOrigin = computed<ServiceTaskPartial>(() =>
  props.serviceTaskId
  && ServiceTask.hydratedGet(props.serviceTaskId as string)
  || {
    description: '',
    date: todayStringDate(),
    siteId: route.query.siteId as string,
    processing: 'draft',
    assigneeId: undefined,
    services: [{ articleId: undefined, price: undefined }],
  })

const { form: formRef } = useFormValidate()

async function save(task: Partial<HydratedServiceTask>) {
  await saveFn(task)
  await ServiceTaskHistory.fetchAll({ serviceTaskId: task.id })
}

function commentClick() {
  loading.value = true
  ServiceTaskHistory.create({
    serviceTaskId: props.serviceTaskId,
    comment: comment.value,
    timestamp: todayStringDate(),
  })
    .then(() => {
      comment.value = ''
    })
    .finally(() => {
      loading.value = false
    })
}

function deleteComment(id: string) {
  loading.value = true
  ServiceTaskHistory.destroy(id)
    .finally(() => {
      loading.value = false
    })
}
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.el-form {
  margin-top: 20px;
}

.float-right {
  float: right;
}

.full-height {
  display: flex;
  flex-direction: column;
}
</style>
