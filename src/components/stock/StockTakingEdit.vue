<template lang="pug">

drawer-edit.stock-taking-edit(
  :title="$tGen('editing', 'stockTaking')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="editable"
  :is-drawer="isDrawer"
  :after-close-to="afterCloseTo"
)
  template(#default="{ model }")
    stock-taking-form(
      ref="form"
      :model="model"
      :disabled="!editable"
    )

</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockTaking, { workflow } from '@/models/StockTaking.js';
import StockTakingForm from '@/components/stock/StockTakingForm.vue';

const props = withDefaults(defineProps<{
  stockTakingId?: string;
  from?: object;
  editRoute?: string;
  isDrawer?: boolean;
}>(), { isDrawer: true });

const form = ref(null);
const afterCloseTo = ref(null);
const route = useRoute();

const modelOrigin = computed(() => {
  const { stockTakingId } = props;
  const { storageId } = route.query;
  return stockTakingId ? StockTaking.reactiveGet(stockTakingId) : {
    date: new Date().toJSON(),
    processing: 'progress',
    deviceCts: new Date().toJSON(),
    storageId,
  };
});

const editable = computed(() => {
  const { processing } = modelOrigin.value || {};
  return workflow.step(processing).editable;
});

async function saveFn(props) {
  const { id: stockTakingId, processing } = await StockTaking.createOne(props);
  if (processing === 'progress') {
    afterCloseTo.value = {
      name: 'stockTakingProgress',
      params: { stockTakingId },
    };
  }
  return StockTaking.reactiveGet(stockTakingId);
}

function destroyFn(id) {
  return StockTaking.destroy(id);
}

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.stock-taking-edit {
  text-align: left;
  @include responsive-only(xxs) {
    text-align: right;
  }
}
</style>
