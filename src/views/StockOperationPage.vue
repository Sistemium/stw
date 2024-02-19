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
        template(
          v-if="stockOperationItems.length"
        )
          stock-operation-item-list(
            :items="stockOperationItems"
            @click="onItemClick"
            :price-field="priceField"
            @avatarClick="onAvatarClick"
            :date="stockOperation.date"
            :vat-prices="vatOperationConfig.vatPrices"
            :storage-id="stockOperation.storageId"
            :show-self-cost="operationName==='stockWithdrawing'"
          )
          .total(v-if="stockOperation?.totalCost")
            label {{ $t("fields.total") }}:&nbsp;
            strong {{ $nr(stockOperation?.totalCost) }} &euro;
          .total(v-if="isWithdrawing")
            label {{ $t("fields.totalSelfCost") }}:&nbsp;
            strong {{ $nr(totalSelfCost) }} &euro;

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

import sumBy from 'lodash/sumBy';
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
import { configPriceField, stockOperationToViewData } from '@/services/warehousing.js'
import { workflow } from '@/models/StockWithdrawing.js';
import { useBusy } from '@/views/pages';
import { useOperationDisabled } from '@/services/workflowing';
import type {
  StockOperation,
  StockOperationItem,
  StockOperationName,
} from '@/models/StockOperations'
import { useRouteParams } from '@/lib/updateRouteParams';
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue';
import { t } from '@/lib/validations';
import { actHeadRows, stockOperationAct } from '@/services/stockoperating';
import type { BaseItem } from 'sistemium-data'
import ArticlePicturesPage from '@/views/ArticlePicturesPage.vue'
import { useVatConfig } from '@/services/vatConfiguring'


const props = defineProps<{
  stockOperationId?: string;
  from?: {
    name: string;
    params?: object;
  };
  model: ReactiveModel<StockOperation>;
  positionsModel: ReactiveModel;
  counterpartyRole: string;
  operationName: StockOperationName
  rootState?: string;
  editRoute?: string;
  createRoute?: string;
}>();

const router = useRouter();
const { setBusy, isBusy } = useBusy();
const { updateRouteParams } = useRouteParams();
const { vatOperationConfig } = useVatConfig(props.operationName)

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

const isWithdrawing = computed(() => props.operationName === 'stockWithdrawing')

const stockOperation = computed(() => {
  return stockOperationToViewData(props.model.reactiveGet(props.stockOperationId), props.positionsModel, props.operationName);
});

const totalSelfCost = computed(() => {
  const { storageId, date } = stockOperation.value
  const { vatPrices } = vatOperationConfig.value
  const costField = vatPrices ? 'vatCost' : 'cost';
  const data = stockOperationAct(stockOperationItems.value, storageId as string, date as string)
  return sumBy(data, item => {
    return (item[costField] * item.units) || 0
  })
})

const { disabled } = useOperationDisabled(stockOperation, workflow);
const galleryArticleId = ref('')

const downloadExcelName = computed(() => {
  return [
    t(`menu.${props.operationName}`),
    dayjs(stockOperation.value.date).format('YYYY-MM-DD'),
  ].join('-');
});

function downloadColumns() {
  const { vatPrices } = vatOperationConfig.value
  const priceField = vatPrices ? 'vatPrice' : 'price';
  const costField = vatPrices ? 'vatCost' : 'cost';
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
    }, {
      key: priceField,
      title: t(`fields.${priceField}`),
      width: 15,
    }, {
      key: vatPrices ? 'totalWithVat': 'total',
      title: t('fields.total'),
      width: 15,
    }, {
      key: costField,
      title: t(`fields.cost`),
      width: 15,
    },
  ];
}

function onAvatarClick(articleId: string) {
  galleryArticleId.value = articleId
}

function downloadExcelData() {
  const columns = downloadColumns();
  const { storageId, date } = stockOperation.value

  return {
    schema: {
      columns,
      headRows: actHeadRows(stockOperation.value, props.operationName, props.counterpartyRole),
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToWidth: 1 },
      grid: { style: 'thin' },
    },
    data: stockOperationAct(stockOperationItems.value, storageId as string, date as string)
      .map(pick(map(columns, 'key'))),
  };
}

function onAddItem() {
  updateRouteParams({
    stockOperationId: props.stockOperationId,
  }, {}, props.createRoute);
}

function onItemClick(item: StockOperation) {
  updateRouteParams({
    stockOperationId: props.stockOperationId,
    stockOperationItemId: item.id,
  }, {}, props.editRoute);
}

function onEditClose(record: StockOperation) {
  if (!record) {
    router.replace({
      name: props.from?.name,
      query: router.currentRoute.value.query,
    });
  }
}

function onProcessing(processing: string) {
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

.total {
  padding: $padding;
  text-align: right;
  font-size: 14px;
}
</style>
