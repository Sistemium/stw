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
    storage-form(ref="form" :model="model")

</template>
<script setup>
import { computed } from 'vue';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import Storage from '@/models/Storage';
import StorageForm from '@/components/stock/StorageForm.vue';

const props = defineProps({
  storageId: String,
  from: Object,
});

const modelOrigin = computed(() => {
  const { storageId } = props;
  return storageId ? Storage.reactiveGet(storageId) : { type: 'facility' };
});

function saveFn(obj) {
  return Storage.createOne(obj);
}

function destroyFn(id) {
  return Storage.destroy(id);
}

</script>
