<template lang="pug">

drawer-edit.storage-edit(
  :title="$tGen('editing', 'storage')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
)
  template(#default="{ model }")
    storage-form(
      ref="form"
      :model="model"
      :disabled="readOnly"
    )

</template>
<script setup lang="ts">
import { computed } from 'vue'
import DrawerEdit from '@/lib/DrawerEdit.vue'
import Storage, { type IStorage } from '@/models/Storage'
import StorageForm from '@/components/stock/StorageForm.vue'
import type { BaseItem } from '@/init/Model'
import { hasSiteAuth } from '@/services/validating'

const props = defineProps<{
  storageId: string
  from: BaseItem
}>()

const modelOrigin = computed<Partial<IStorage>>(() => {
  const { storageId } = props
  return storageId && Storage.reactiveGet(storageId) || { type: 'facility' }
})

const readOnly = computed(() => {
  const siteId = modelOrigin.value?.siteId
  return !!siteId && !hasSiteAuth(siteId)
})

function saveFn(obj: IStorage) {
  return Storage.createOne({
    ...obj,
    employeeId: obj.type === 'facility' ? null : obj.employeeId,
  })
}

function destroyFn(id: string) {
  return Storage.destroy(id)
}

</script>
