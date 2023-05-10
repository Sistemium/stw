<template lang="pug">

el-dialog.stock-article-details-view(
  v-model="visible"
  :title="title"
  :fullscreen="fullscreen"
  :show-close="true"
  :append-to-body="true"
  width="75%"
  @closed="handleClose()"
)

  .filters
    label {{ $t('fields.dateB') }}
    el-date-picker(v-model="period.dateB")
    label {{ $t('fields.toDate') }}
    el-date-picker(v-model="period.dateE")

  el-tabs(
    v-model="currentTab"
    v-loading="loading"
  )
    el-tab-pane(
      v-for="tab in tabs"
      :key="tab.id"
      :lazy="true"
      :name="tab.id"
    )
      template(#label)
        span {{ $t(tab.id) }}
        el-badge(
          type="info"
          :value="tab.badge"
          size="small"
        )
      stock-article-operations-table(
        :operations="tab.operations"
        :counterparty="tab.counterparty"
        @row-click="row => operationClick(tab, row)"
      )

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Article from '@/models/Article.js';
import { findStockPeriodOperations } from '@/services/warehousing.js';
import StockArticleOperationsTable from '@/components/stock/StockArticleOperationsTable.vue';

interface StockDetailsData {
  in?: object[];
  out?: object[];
  fix?: object[];
}

const props = defineProps<{
  modelValue: boolean;
  articleId: string;
  storageId: string;
  dateB: string;
  dateE: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean);
}>();

const loading = ref(false);
const data = ref<StockDetailsData>({});
const currentTab = ref(null);
const period = ref({
  dateB: new Date(props.dateB),
  dateE: new Date(props.dateE),
});

const router = useRouter();

const title = computed(() => Article.reactiveGet(props.articleId)?.name);
const tabs = computed(() => {
  const {
    fix = [],
    in: incoming = [],
    out = [],
  } = data.value;
  return [
    {
      id: 'fields.unitsSur',
      badge: fix.length,
      operations: fix,
      counterparty: null,
      route: 'stockTakingProgress',
      routeParam: 'stockTakingId',
    },
    {
      id: 'fields.unitsIn',
      badge: incoming.length,
      operations: incoming,
      counterparty: 'fields.supplier',
      route: 'stockReceiving',
      routeParam: 'stockOperationId',
    },
    {
      id: 'fields.unitsOut',
      badge: out.length,
      operations: out,
      counterparty: 'fields.consignee',
      route: 'stockWithdrawing',
      routeParam: 'stockOperationId',
    },
  ];
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(visible) {
    emit('update:modelValue', visible);
  },
});

const fullscreen = false;
watch(period, refresh, { deep: true, immediate: true });

function operationClick(tab, row) {
  const to = {
    name: tab.route,
    params: { [tab.routeParam]: row.parentId },
  };
  router.push(to)
    .catch(e => console.error('operationClick', e));
}

function handleClose() {
  visible.value = false;
}

function refresh({ dateB, dateE }) {
  loading.value = true;
  findStockPeriodOperations(props.articleId, props.storageId, dateB, dateE)
    .then(res => {
      data.value = res;
      const tab = tabs.value.find(({ operations }) => operations.length);
      if (tab) {
        currentTab.value = tab.id;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

</script>
<style scoped lang="scss">
@import "@/styles/variables.scss";

.el-badge {
  margin-left: $padding;
}

.filters {
  display: flex;
  flex-direction: row;
  align-items: center;

  label {
    padding: $padding;
  }

  margin-bottom: $margin-top;

  .el-date-editor {
    flex: 1;
  }
}

</style>
