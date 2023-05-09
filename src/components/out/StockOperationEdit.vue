<template lang="pug">

drawer-edit.stock-operation-edit(
  :title="$tGen('editing', operationName)"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="!disabled"
  :is-drawer="isDrawer"
)
  template(#default="{ model: drawerModel }")
    stock-operation-form(
      ref="form"
      :model="drawerModel"
      :counterparty-role="counterpartyRole"
      :disabled="disabled"
    )

</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReactiveModel from 'sistemium-data-vue';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockOperationForm from '@/components/out/StockOperationForm.vue';
import type ApiModel from '@/models/ApiModels';
import type { StockOperation } from '@/models/StockOperations';

const props = withDefaults(defineProps<{
  stockOperationId?: string;
  from?: object;
  editRoute?: string;
  isDrawer?: boolean;
  model: ReactiveModel;
  operationName: string;
  counterpartyRole: string;
}>(), { isDrawer: true });

const route = useRoute();
const router = useRouter();
const form = ref(null);

const modelOrigin = computed((): StockOperation => {
  const { stockOperationId } = props;
  return stockOperationId
    ? props.model.reactiveGet(stockOperationId) as StockOperation
    : {
      date: new Date().toJSON(),
      processing: 'progress',
      counterpartyType: null,
      counterpartyId: null,
      storageId: route.query.storageId as string || null,
      commentText: null,
      deviceCts: new Date().toJSON(),
    };
});

const disabled = computed(() => modelOrigin.value.processing === 'finished');

async function saveFn(obj) {
  const { id: stockOperationId } = await props.model.createOne(obj) as ApiModel;
  if (!props.stockOperationId) {
    setTimeout(() => {
      router.push({
        name: props.editRoute,
        params: { stockOperationId },
      })
        // .then(res => $debug(res))
        .catch(e => console.error(e));
    }, 1);
  }
  return props.model.reactiveGet(stockOperationId);
}

function destroyFn(id) {
  return props.model.destroy(id);
}

</script>
<style scoped lang="scss">

</style>
