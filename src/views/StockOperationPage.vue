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
        download-excel-button(
          :data-fn="downloadExcelData"
          :name="downloadExcelName"
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
          @avatarClick="onAvatarClick"
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
  article-pictures-page(
    v-if="galleryArticleId"
    :article-id="galleryArticleId"
    :authoring="false"
    @closed="galleryArticleId = ''"
  )
</template>
<script setup lang="ts">

import map from 'lodash/map';
import pick from 'lodash/fp/pick';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
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
import type { StockOperation, StockOperationItem } from '@/models/StockOperations';
import { useRouteParams } from '@/lib/updateRouteParams';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import { t } from '@/lib/validations';
import { actHeadRows, stockOperationAct } from '@/services/stockoperating';
import type { BaseItem } from 'sistemium-data'
import ArticlePicturesPage from '@/views/ArticlePicturesPage.vue'


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
  if (!stockOperationId) {
    return []
  }
  const filter: BaseItem = {
    [`${props.operationName}Id`]: stockOperationId,
  }
  return props.positionsModel?.reactiveFilter(filter) as StockOperationItem[];
});

const stockOperation = computed<StockOperation>(() => {
  return props.model.reactiveGet(props.stockOperationId) || {};
});

const { disabled } = useOperationDisabled(stockOperation, workflow);
const galleryArticleId = ref('')

const downloadExcelName = computed(() => {
  return [
    t(`menu.${props.operationName}`),
    dayjs(stockOperation.value.date).format('YYYY-MM-DD'),
  ].join('-');
});

function downloadColumns() {
  return [
    {
      key: 'code',
      title: t('fields.code'),
      width: 30,
    }, {
      key: 'name',
      title: t('concepts.article'),
      width: 55,
      wrapText: true,
    }, {
      key: 'units',
      title: t('fields.quantity'),
      width: 15,
    },
  ];
}

function onAvatarClick(articleId: string) {
  galleryArticleId.value = articleId
}

function downloadExcelData() {
  const columns = downloadColumns();

  return {
    schema: {
      columns,
      headRows: actHeadRows(stockOperation.value, props.operationName, props.counterpartyRole),
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToWidth: 1 },
      grid: { style: 'thin' },
    },
    data: stockOperationAct(stockOperationItems.value)
      .map(pick(map(columns, 'key'))),
  };
}

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
    router.replace({
      name: props.from.name,
      query: router.currentRoute.value.query,
    });
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
