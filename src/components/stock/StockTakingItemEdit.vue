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
      template(#article-extra)
        vat-mode-switch(v-model="formVatPrices" v-if="editable")
        price-form(:model="model" :vat-prices="formVatPrices")
        article-cost-info(
          v-if="model.articleId"
          :article-id="model.articleId"
          :storage-id="stockTaking.storageId"
          :date="stockTaking.date"
          :vat-prices="formVatPrices"
          :vat-rate="modelOrigin.vatRate"
          :units="1"
          type="initCost"
        )

</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockTakingItem from '@/models/StockTakingItem.js';
import StockTaking, { workflow } from '@/models/StockTaking.js';
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue';
import { stockTakingItemInstance } from '@/services/warehousing.js';
import VatModeSwitch from '@/components/out/VatModeSwitch.vue';
import PriceForm from '@/components/out/PriceForm.vue';
import { useVatConfig } from '@/services/vatConfiguring';
import ArticleCostInfo from '@/components/production/ArticleCostInfo.vue';

const props = defineProps({
  stockTakingId: { type: String, required: true },
  stockTakingItemId: String,
  from: Object,
  barcode: String,
});

const { vatOperationConfig } = useVatConfig('stockReceiving');

const formVatPrices = ref(vatOperationConfig.value.vatPrices);

const stockTaking = computed(() => StockTaking.reactiveGet(props.stockTakingId));
const modelOrigin = computed(() => {
  const { stockTakingItemId: id, stockTakingId, barcode = null } = props;
  const { vatRate } = vatOperationConfig.value;
  return id ? { ...StockTakingItem.reactiveGet(id), vatRate }
    : stockTakingItemInstance({
      stockTakingId,
      barcode,
      vatRate,
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
