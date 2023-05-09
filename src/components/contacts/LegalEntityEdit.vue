<template lang="pug">

drawer-edit.legal-entity-edit(
  :title="$tGen('editing', 'legalEntity')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :is-drawer="isDrawer"
)
  template(#default="{ model }")
    legal-entity-form(:model="model")

</template>
<script setup lang="ts">
import { computed } from 'vue';
import { drawerEditingProps, useDrawerEditing } from '@/services/drawerEditing';
import LegalEntity from '@/models/LegalEntity.js';
import LegalEntityForm from '@/components/contacts/LegalEntityForm.vue';
import DrawerEdit from '@/lib/DrawerEdit.vue';

const props = defineProps({
  ...drawerEditingProps,
  legalEntityId: String,
});

const modelOrigin = computed(() => {
  const { legalEntityId } = props;
  return legalEntityId
    ? LegalEntity.reactiveGet(legalEntityId)
    : {
      name: null,
      code: null,
      vatCode: null,
      address: null,
    };
});

const { destroyFn, saveFn } = useDrawerEditing(LegalEntity);

</script>
