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
      :finished="finished"
      :model="drawerModel"
      :vat-prices="vatOperationConfig.vatPrices"
      :vat-rate="vatOperationConfig.vatRate"
      :storage-id="stockOperation.storageId"
      :date="stockOperation.date"
      :pricing="pricing"
    )

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import ReactiveModel from 'sistemium-data-vue';
import { workflow } from '@/models/StockWithdrawing.js';
import { stockOperationItemInstance } from '@/services/warehousing.js';
import StockOperationItemForm from '@/components/out/StockOperationItemForm.vue';
import { useVatConfig } from '@/services/vatConfiguring';
import { drawerEditingProps, useDrawerEditing } from '@/services/drawerEditing';
import type { StockOperation, StockOperationName } from '@/models/StockOperations'
import DrawerEdit from '@/lib/DrawerEdit.vue';
import Pricing from '@/models/Pricing'
import { fetchArticlePricing } from '@/services/dataSync'

const props = defineProps({
  ...drawerEditingProps,
  stockOperationId: { type: String, required: true },
  stockOperationItemId: String,
  barcode: String,
  operationName: { type: String, required: true },
  model: { type: ReactiveModel, required: true },
  positionsModel: { type: ReactiveModel, required: true },
});

const form = ref(null);
const { destroyFn, saveFn } = useDrawerEditing(props.positionsModel);
const { vatOperationConfig } = useVatConfig(props.operationName as StockOperationName);
const stockOperation = computed(() => props.model.reactiveGet(props.stockOperationId) as StockOperation);
const pricing = computed(() => Pricing.reactiveGet(stockOperation.value?.pricingId))

const modelOrigin = computed(() => {
  const { stockOperationItemId: id, stockOperationId, barcode = null } = props;
  const { vatRate } = vatOperationConfig.value;
  if (id) {
    return props.positionsModel?.reactiveGet(id)
  }
  return stockOperationItemInstance(props.operationName as StockOperationName, {
    stockOperationId,
    barcode,
    articleId: null,
    vatRate,
  });
});

watch(pricing, p => {
  if (p) {
    fetchArticlePricing(p.id)
      .catch(e => console.error(e))
  }
})

const finished = computed(() => {
  return !workflow.step(stockOperation.value?.processing)?.editable;
});

const editable = computed(() => {
  return !finished.value && !stockOperation.value?.sourceId;
});

</script>
