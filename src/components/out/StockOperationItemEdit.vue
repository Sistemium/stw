<template lang="pug">

drawer-edit.stock-operation-item-edit(
  :title="$tGen('editing', `${operationName}Item`)"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="editable"
  :is-drawer="isDrawer"
)
  template(#default="{ model: drawerModel }")
    stock-operation-item-form(
      ref="form"
      :editable="editable"
      :model="drawerModel"
      :vat-prices="vatOperationConfig.vatPrices"
      :vat-rate="vatOperationConfig.vatRate"
      :storage-id="stockOperation.storageId"
      :date="stockOperation.date"
    )

</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import ReactiveModel from 'sistemium-data-vue';
import { workflow } from '@/models/StockWithdrawing.js';
import { stockOperationItemInstance } from '@/services/warehousing.js';
import StockOperationItemForm from '@/components/out/StockOperationItemForm.vue';
import { useVatConfig } from '@/services/vatConfiguring';
import { drawerEditingProps, useDrawerEditing } from '@/services/drawerEditing';
import type { StockOperation } from '@/models/StockOperations';
import DrawerEdit from '@/lib/DrawerEdit.vue';

const props = defineProps({
  ...drawerEditingProps,
  stockOperationId: { type: String, required: true },
  stockOperationItemId: String,
  barcode: String,
  operationName: { type: String, required: true },
  model: ReactiveModel,
  positionsModel: ReactiveModel,
});

const form = ref(null);
const { destroyFn, saveFn } = useDrawerEditing(props.positionsModel);
const { vatOperationConfig } = useVatConfig(props.operationName);
const stockOperation = computed(() => props.model.reactiveGet(props.stockOperationId) as StockOperation);

const modelOrigin = computed(() => {
  const { stockOperationItemId: id, stockOperationId, barcode = null } = props;
  const { vatRate } = vatOperationConfig.value;
  return id
    ? props.positionsModel.reactiveGet(id)
    : stockOperationItemInstance(props.operationName, {
      stockOperationId,
      barcode,
      articleId: null,
      vatRate,
    });
});

const editable = computed(() => {
  return workflow.step(stockOperation.value?.processing).editable;
});

</script>
