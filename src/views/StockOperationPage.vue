<template lang="pug">

.stock-withdrawing

  el-tabs(tab-position="top")

    el-tab-pane(:lazy="true" :label="$t('concepts.items')")
      .buttons
        workflow-transitions(
          :workflow="workflow"
          :model-value="stockOperation.processing"
          :disabled="isBusy"
          @update:model-value="onProcessing"
        )
        tool-button(
          tool="add"
          @click="onAddItem"
          :disabled="disabled"
        )
      resize(:padding="20")
        stock-operation-item-list(
          :items="stockOperationItems"
          @click="onItemClick"
          v-if="stockOperationItems.length"
          :price-field="priceField"
        )
        alert-empty(
          v-else
          @click="onAddItem"
          :button-text="$tAction('add', 'position')"
          :disabled="disabled"
        )

    el-tab-pane(:lazy="true" :label="$t('concepts.settings')")
      stock-operation-edit(
        :is-drawer="false"
        :stock-operation-id="stockOperationId"
        @closed="onEditClose"
        :counterparty-role="counterpartyRole"
        :model="model"
        :operation-name="operationName"
      )
  router-view

</template>
<script setup lang="ts">

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ReactiveModel from 'sistemium-data-vue';
import ToolButton from '@/lib/ToolButton.vue';
import Resize from '@/lib/StmResize.vue';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import WorkflowTransitions from '@/lib/WorkflowTransitions.vue';
import StockOperationItemList from '@/components/out/StockOperationItemList.vue';
import StockOperationEdit from '@/components/out/StockOperationEdit.vue';
import { configPriceField } from '@/services/warehousing.js';
import { workflow } from '@/models/StockWithdrawing.js';
import { useBusy } from '@/views/pages';
import { useOperationDisabled } from '@/services/workflowing';
import type { StockOperation } from '@/models/StockOperations';
import { useRouteParams } from '@/lib/updateRouteParams';


const props = defineProps<{
  stockOperationId?: string;
  from?: {
    name: string;
    params?: object;
  };
  model: ReactiveModel;
  positionsModel?: ReactiveModel;
  counterpartyRole?: string;
  operationName: string;
  rootState?: string;
  editRoute?: string;
  createRoute?: string;
}>();

const router = useRouter();
const { setBusy, isBusy } = useBusy();
const { updateRouteParams } = useRouteParams();

const priceField = computed(() => {
  return configPriceField(props.operationName, stockOperation.value.date);
});

const stockOperationItems = computed(() => {
  const { stockOperationId } = props;
  return props.positionsModel.reactiveFilter({
    [`${props.operationName}Id`]: stockOperationId,
  });
});

const stockOperation = computed<StockOperation>(() => {
  return props.model.reactiveGet(props.stockOperationId) || {};
});

const { disabled } = useOperationDisabled(stockOperation, workflow);

function onAddItem() {
  updateRouteParams({
    stockOperationId: props.stockOperationId,
  }, {}, props.createRoute);
}

function onItemClick(item) {
  updateRouteParams({
    stockOperationId: props.stockOperationId,
    stockOperationItemId: item.id,
  }, {}, props.editRoute);
}

function onEditClose(record) {
  if (!record) {
    router.replace({ name: props.from.name });
  }
}

function onProcessing(processing) {
  setBusy(props.model.updateOne({ id: props.stockOperationId, processing }));
}

</script>
<style scoped lang="scss">
@import "../styles/variables";

.stock-withdrawing {
  flex: 1;
}

.stock-operation-edit {
  text-align: left;
  @include responsive-only(xxs) {
    text-align: right;
  }
}
</style>
