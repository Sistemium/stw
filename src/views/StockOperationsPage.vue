<template lang="pug">

.stock-withdrawals-page

  page-title(:title="`menu.${rootState}`")
    menu-button(
      label="menu.reports"
      :options="reports"
    )
      template(#items)
        li.el-dropdown-menu__item
          download-excel-button(
            :data-fn="downloadExcelData"
            :name="downloadExcelName"
          )

  el-container
    component(:is="showDetails ? 'el-aside' : 'el-main'")
      .filters
        search-input(v-model="search")
        .date-picker
          el-date-picker(
            v-model="dateRange"
            type="daterange"
            :unlink-panels="true"
          )
        .buttons
          storage-select(
            v-model="storageId"
            ref="storageSelectRef"
            :disabled="showDetails"
          )
          tool-button(
            v-if="showDetails"
            tool="back"
            @click="onBack"
          )
          tool-button(
            tool="add"
            @click="onAdd()"
          )
      resize#stock-operation-scroll(
        :padding="20"
        @resized="setHeight"
      )
        template(v-if="viewData.length")
          template(
            v-if="showList"
          )
            .list-group(v-if="showRow")
              stock-operation-list-item(
                :source="showRow"
              )
            stock-operation-list(
              v-else-if="tableHeight"
              ref="operationListRef"
              :view-data="viewData"
              :active-id="route.params.stockOperationId"
              @click="onItemClick"
            )
          stock-operation-table(
            v-else
            :height="tableHeight"
            :view-data="viewData"
            :size="tableSize"
            :counterparty-role="counterpartyRole"
            @click="onItemClick"
          )
      alert-empty(
        v-if="store.currentStorageId && !stockOperations.length"
        @click="onAdd()"
        :button-text="$tAction('start', operationName)"
      )

    router-view

</template>
<script setup lang="ts">
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import { stockOperationToViewData, searchOperations } from '@/services/warehousing.js';
import StockOperationList from '@/components/out/StockOperationList.vue';
import StockOperationTable from '@/components/out/StockOperationTable.vue';
import StockOperationListItem from '@/components/out/StockOperationListItem.vue';
import MenuButton from '@/components/MenuButton.vue';
import SearchInput from '@/lib/SearchInput.vue';
import Resize from '@/lib/StmResize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { useRouteParams } from '@/lib/updateRouteParams';
import { useRoute } from 'vue-router';
import { useInvStore } from '@/store/invStore';
import orderBy from 'lodash/orderBy';
import ReactiveModel from 'sistemium-data-vue';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import useResponsiveTables from '@/components/useResponsiveTables';
import StorageSelect from '@/components/select/StorageSelect.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useScrollToCreated } from '@/services/scrolling';
import type { StockOperation, StockOperationName } from '@/models/StockOperations'
import type { BaseItem } from '@/init/Model'
import { t } from '@/lib/validations'
import DownloadExcelButton from '@/lib/DownloadExcelButton.vue'
import Article from '@/models/Article'
import Storage from '@/models/Storage'

const { VITE_SUPPLIER_CODE_PROP_ID, VITE_PRODUCER_CODE_PROP_ID } = import.meta.env

const props = defineProps<{
  model: ReactiveModel;
  positionsModel: ReactiveModel;
  operationName: StockOperationName;
  counterpartyRole: string;
  rootState: string;
  editRoute: string;
  createRoute: string;
}>();

const today = dayjs().endOf('day');
const monthAgo = today.add(-12, 'month');
const { updateRouteParams } = useRouteParams();
const route = useRoute();
const { showTable, tableSize, windowWidth } = useResponsiveTables();
const store = useInvStore();
const tableHeight = ref<number>();
// TODO: auto open if empty
const storageSelectRef = ref();
const operationListRef = ref<{ scrollToId(id: string): boolean }>();

useScrollToCreated({
  blink: false,
  watchFor: 'stockOperationId',
  watchToRepeat() {
    return !!route.query.search;
  },
  ifIdExistsFn(id: string) {
    return !!operationListRef.value && !!viewData.value.find(item => id === item.id);
  },
  scrollToIdFn(id: string) {
    return operationListRef.value?.scrollToId(id);
  },
});

const search = computed({
  get() {
    return route.query.search || '';
  },
  set(search) {
    updateRouteParams({}, { search: search || undefined });
  },
});

const viewData = computed(() => {
  return stockOperations.value
    .map(o => stockOperationToViewData(o, props.positionsModel, props.operationName));
});


const showList = computed(() => !showTable.value || showDetails.value);
const showRow = computed(() => {
  if (!showList.value || windowWidth.value > 992) {
    return null;
  }
  return viewData.value.find(({ id }) => id === route.params.stockOperationId);
});

const stockOperations = computed(() => {
  if (!storageId.value) {
    return [];
  }
  const [dateB, dateE] = dateRange.value.map(d => dayjs(d).toJSON())
  const data = props.model.reactiveManyByIndex('storageId', storageId.value)
    .filter(({ date  }) => date >= dateB && date <= dateE);
  const filtered = search.value
    ? data.filter(searchOperations(search.value as string, props.positionsModel, `${props.operationName}Id`))
    : data;
  return orderBy(filtered, ['date', 'cts'], ['desc', 'desc']);
});

const showDetails = computed(() => {
  return route.name === props.editRoute
    || !!find(route.matched, matchDetails);
});

const dateRange = computed({
  get() {
    const { dateB, dateE } = route.query
    return [
      dayjs(dateB as string || monthAgo).toDate(),
      dayjs(dateE as string || today).toDate(),
    ];
  },
  set([dateB, dateE]) {
    updateRouteParams({}, {
      dateB: dayjs(dateB).toJSON(),
      dateE: dayjs(dateE).toJSON(),
    })
  }
})

function matchDetails({ name }: { name: string }) {
  return name.match(`^${props.editRoute}(ItemEdit)?`);
}

const storageId = computed({
  get() {
    const { stockOperationId } = route.params;
    if (stockOperationId) {
      const { storageId: id } = props.model.reactiveGet(stockOperationId as string) as StockOperation || {};
      if (id) {
        return id;
      }
    }
    return store.currentStorageId;
  },
  set(id) {
    store.currentStorageId = id;
  },
});

const reports = [{ label: 'reports.stockMovement', to: 'stockMovementReport' }];

function setHeight(height: number) {
  tableHeight.value = height;
}

function onAdd() {
  updateRouteParams({
    stockOperationId: undefined,
  }, { storageId: storageId.value }, props.createRoute);
}

function onItemClick(item: any) {
  updateRouteParams({
    stockOperationId: item.id,
  }, {}, props.editRoute);
}

function onBack() {
  updateRouteParams({
    stockOperationId: undefined,
  }, {}, props.rootState);
}

/*
Excel
 */

const downloadExcelName = computed(() => {
  const [dateB, dateE] = dateRange.value.map(d => dayjs(d).format('YYYY-MM-DD'))
  return [
    t(`menu.${props.operationName}`),
    Storage.getByID(storageId.value)?.name,
    dateB,
    dateE,
  ].join('-');
});

function downloadExcelData() {
  const parentCol = `${props.operationName}Id`
  const data = viewData.value.map((item) => {
    const positions: BaseItem[] = props.positionsModel.reactiveManyByIndex(parentCol, item.id as string);
    const date = dayjs(item.date).format('YYYY-MM-DD')
    const counterpartyType = t(`fields.counterparty.${item.counterpartyType || 'undefined'}`)
    return positions.map(position => {
      const article = Article.getByID(position.articleId)
      return {
        ...item,
        ...position,
        articleName: article?.name,
        articleCode: article?.code,
        counterpartyType,
        date,
        supplierCode: article?.props.find(({ propId }) => propId === VITE_SUPPLIER_CODE_PROP_ID)?.stringValue,
        producerCode: article?.props.find(({ propId }) => propId === VITE_PRODUCER_CODE_PROP_ID)?.stringValue,
      }
    })
  })
  return {
    schema: downloadSchema(),
    data: flatten(data),
  }
}

function downloadSchema() {
  const counterpartyLabel = t(`fields.${props.counterpartyRole}`)

  return {
    wrapText: true,
    columns: [
      {
        key: 'id',
        title: 'ID',
        width: 0,
      }, {
        key: 'date',
        title: t('fields.date'),
        width: 15,
      }, {
        key: 'ndoc',
        title: t('fields.ndoc'),
        width: 15,
      }, {
        key: 'counterpartyType',
        title:  t(`fields.${props.counterpartyRole}Type`),
        width: 30,
      }, {
        key: 'commentText',
        title: t('fields.commentText'),
        width: 55,
      }, {
        key: 'counterpartyName',
        title: counterpartyLabel,
        width: 55,
      }, {
        key: 'articleName',
        title: t('concepts.article'),
        width: 55,
      }, {
        key: 'articleCode',
        title: t('fields.code'),
        width: 30,
      }, {
        key: 'supplierCode',
        title: t('fields.supplierCode'),
        width: 30,
      }, {
        key: 'producerCode',
        title: t('fields.producerCode'),
        width: 30,
      }, {
        key: 'units',
        title: t('fields.units'),
        width: 15,
      }, {
        key: 'price',
        title: t('fields.withoutVatPrice'),
        width: 15,
      },
      // ...tableData.propColumns
      //   .map(({ id, name }) => ({ key: id, title: name, width: 25 })),
    ],
  };
}

</script>
<style scoped lang="scss">
@import "@/styles/variables";

@include responsive-only(lt-md) {
  .el-container {
    flex-direction: column;
  }
  .el-aside {
    width: 100% !important;
    margin-bottom: $margin-right;
  }
  .el-aside :deep(.stock-operation-list-item) {
    background: none;
    border-top: none;

    &, .el-button {
      color: inherit;
    }
  }
}

.filters {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: $padding;
}

.el-aside {
  margin-right: $margin-top;

  .filters {
    flex-direction: column;
  }

  .date-picker {
    width: auto;
    margin-bottom: $padding;
  }

  .search-input {
    width: 100%;
    margin-bottom: $padding;
  }

  .buttons {
    .storage-select {
      flex: 1;
    }
  }
}

.stm-resize {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.stock-operation-list {
  overflow-y: auto;
}

.el-main {
  padding: 0;
}

.menu-button {
  float: right;
}

.date-picker :deep(.el-date-editor) {
  width: auto;
  margin: auto;
}

</style>
