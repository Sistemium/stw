<template lang="pug">

el-table.stock-operation-table(
  :data="viewData"
  @row-click="row => emit('click', row)"
  :size="size"
  :height="height"
)
  el-table-column(
    prop="processing"
    :label="$t('fields.processing')"
    :width="columnSize"
  )
  el-table-column(
    prop="date"
    :label="$t('fields.date')"
    :width="columnSize"
    :formatter="(r,c,date) => $ts(date, 'short')"
  )
  el-table-column(
    prop="counterpartyName"
    :label="counterpartyLabel"
  )
    template(#default="{ row }")
      .name(v-if="row.counterpartyName") {{ row.counterpartyName }}
      .comment(v-if="row.commentText") {{ row.commentText }}
  el-table-column(
    align="right"
    :label="$t('concepts.items')"
    width="100"
  )
    template(#default="{ row }")
      span(v-if="row.positionsCount") {{ row.positionsCount }}
      //span(v-if="row.productsCount && row.positionsCount") +
      //span(v-if="row.productsCount") {{ row.productsCount }}
  el-table-column(
    align="right"
    prop="units"
    :label="$t('fields.quantity')"
    width="120"
  )
  el-table-column(
    align="right"
    prop="totalCost"
    :label="$t('fields.totalCost')"
    width="120"
  )

</template>
<script setup lang="ts">

import { computed } from 'vue';
import { t } from '@/lib/validations';
import type { StockOperationViewData } from '@/models/StockOperations';


const props = defineProps<{
  viewData: StockOperationViewData[];
  activeId?: string;
  size?: string;
  height?: number;
  counterpartyRole: string;
}>();

const emit = defineEmits<{
  (e: 'click', item: StockOperationViewData): void;
}>();

const counterpartyLabel = computed(() => t(`fields.${props.counterpartyRole}`));
const columnSize = computed(() => props.size === 'small' ? 120 : 140);

</script>
