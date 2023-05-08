<template lang="pug">

drawer-edit.stock-taking-item-edit(
  :title="$tGen('editing', 'stockTakingItem')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="editable"
)
  template(#default="{ model }")
    stock-taking-item-form(
      ref="form"
      :model="model"
      :editable="editable"
    )

</template>
<script setup lang="ts">

import { computed } from 'vue';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockTakingItem from '@/models/StockTakingItem.js';
import StockTaking, { workflow } from '@/models/StockTaking.js';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import { stockTakingItemInstance } from '@/services/warehousing.js';

const props = defineProps({
  stockTakingId: { type: String, required: true },
  stockTakingItemId: String,
  from: Object,
  barcode: String,
});

const stockTaking = computed(() => StockTaking.reactiveGet(props.stockTakingId));
const modelOrigin = computed(() => {
  const { stockTakingItemId: id, stockTakingId, barcode = null } = props;
  return id ? StockTakingItem.reactiveGet(id)
    : stockTakingItemInstance({
      stockTakingId,
      barcode,
      articleId: null,
    });
});

const editable = computed(() => {
  const { processing } = stockTaking.value || {};
  return workflow.step(processing).editable;
});

async function saveFn(obj) {
  return StockTakingItem.createOne(obj);
}

async function destroyFn(id) {
  return StockTakingItem.destroy(id);
}

</script>
