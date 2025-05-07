<template lang="pug">
drawer-edit.user-edit(
  :title="$tGen('editing', 'user')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="!!modelOrigin.id"
  :validate-fn="formRef?.validate"
)
  template(#default="{ model }")
    user-form(
      ref="formRef"
      :model="model"
    )
</template>

<script setup lang="ts">
import { useDrawerEditing } from '@/services/drawerEditing'
import User, { type IUser } from '@/models/User'
import { computed } from 'vue'
import DrawerEdit from '@/lib/DrawerEdit.vue'
import { useFormValidate } from '@/services/validating'
import UserForm from '@/components/users/UserForm.vue'

const { form: formRef } = useFormValidate()
const { saveFn, destroyFn } = useDrawerEditing(User)
const modelOrigin = computed<Partial<IUser>>(() => {
  return props.userId && User.reactiveGet(props.userId) || {}
})

const props = defineProps<{
  userId?: string
  from: Record<string, any>
  drawerStyle?: Record<string, any>
}>()

</script>
