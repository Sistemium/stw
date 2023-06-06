<template lang="pug">

.stock-withdrawals-page

  page-title(:title="`menu.${rootState}`")

  el-container
    component(:is="showDetails ? 'el-aside' : 'el-main'")
      .filters
        search-input(v-model="search")
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
          stock-operation-list(
            v-if="showList"
            ref="operationListRef"
            :view-data="viewData"
            :active-id="route.params.stockOperationId"
            @click="onItemClick"
            :height="tableHeight"
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
import { stockOperationToViewData, searchOperations } from '@/services/warehousing.js';
import StockOperationList from '@/components/out/StockOperationList.vue';
import StockOperationTable from '@/components/out/StockOperationTable.vue';

import SearchInput from '@/lib/SearchInput.vue';
import Resize from '@/lib/StmResize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import { computed, ref } from 'vue';
import { useRouteParams } from '@/lib/updateRouteParams';
import { useRoute } from 'vue-router';
import { useInvStore } from '@/store/invStore';
import orderBy from 'lodash/orderBy';
import ReactiveModel from 'sistemium-data-vue';
// import type { PageProps } from '@/views/pages';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import useResponsiveTables from '@/components/useResponsiveTables';
import StorageSelect from '@/components/stock/StorageSelect.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useScrollToCreated } from '@/services/scrolling';
import type { StockOperation } from '@/models/StockOperations';

const props = defineProps<{
  model: ReactiveModel;
  positionsModel: ReactiveModel;
  operationName: string;
  counterpartyRole: string;
  rootState: string;
  editRoute: string;
  createRoute: string;
}>();


const { updateRouteParams } = useRouteParams();
const route = useRoute();
const { showTable, tableSize } = useResponsiveTables();
const store = useInvStore();
const tableHeight = ref<number>(undefined);
// TODO: auto open if empty
const storageSelectRef = ref(null);
const operationListRef = ref(null);

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

const stockOperations = computed(() => {
  if (!storageId.value) {
    return [];
  }
  const data = props.model.reactiveManyByIndex('storageId', storageId.value);
  const filtered = search.value
    ? data.filter(searchOperations(search.value, props.positionsModel, `${props.operationName}Id`))
    : data;
  return orderBy(filtered, ['date', 'cts'], ['desc', 'desc']);
});

const showDetails = computed(() => {
  return route.name === props.editRoute
    || !!find(route.matched, matchDetails);
});

function matchDetails({ name }) {
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


function setHeight(height) {
  tableHeight.value = height;
}

function onAdd() {
  updateRouteParams({
    stockOperationId: undefined,
  }, { storageId: storageId.value }, props.createRoute);
}

function onItemClick(item) {
  updateRouteParams({
    stockOperationId: item.id,
  }, {}, props.editRoute);
}

function onBack() {
  updateRouteParams({
    stockOperationId: undefined,
  }, {}, props.rootState);
}

</script>
<style scoped lang="scss">
@import "../styles/variables";

@include responsive-only(lt-md) {
  .el-container {
    flex-direction: column;
  }
  .el-aside {
    width: 100% !important;

    :deep(.stock-operation-list-item:not(.active)) {
      display: none;
    }

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
}

.stock-operation-list {
  overflow-y: auto;
}

.el-main {
  padding: 0;
}
</style>
