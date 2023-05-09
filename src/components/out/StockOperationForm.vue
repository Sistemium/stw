<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.stock-operation-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(
    :label="$t('fields.date')"
    prop="date"
  )
    date-string-picker(v-model="model.date")

  el-form-item(
    :label="$t('fields.storage')"
    prop="storageId"
  )
    el-select(v-model="model.storageId")
      el-option(
        v-for="{ id, name } in storages"
        :key="id"
        :label="name"
        :value="id"
      )

  el-form-item(
    :label="$t(counterpartyLabel.type)"
    prop="counterpartyType"
  )
    counterparty-type-switch(
      v-model="model.counterpartyType"
      @change="model.counterpartyId = null"
    )

  el-form-item(
    v-if="model.counterpartyType"
    :label="$t(counterpartyLabel.choice)"
    prop="counterparty"
  )
    button-prepend(@button-click="addCounterparty")
      counterparty-select(
        v-model="model.counterpartyId"
        :type="model.counterpartyType"
      )

  el-form-item(
    :label="$t('fields.processing')"
    prop="processing"
  )
    workflow-button(
      :workflow="workflow"
      v-model="model.processing"
    )

  el-form-item(
    :label="$t('fields.commentText')"
    prop="commentText"
    v-if="!disabled || model.commentText"
  )
    el-input(
      v-model="model.commentText"
      type="textarea"
      :autosize="{ minRows: 2 }"
    )

  component(
    v-if="showDrawer && counterpartyEditComponent"
    :is="counterpartyEditComponent"
    :drawer-style="{ top: '50px' }"
    @saved="counterpartySaved"
    @closed="counterpartyEditClosed"
  )

</template>
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref } from 'vue';
import WorkflowButton from '@/lib/WorkflowButton.vue';
import Storage from '@/models/Storage';
import { workflow } from '@/models/StockWithdrawing';
import DateStringPicker from '@/lib/DateStringPicker.vue';
import ButtonPrepend from '@/lib/ButtonPrepend.vue';
import CounterpartyTypeSwitch from '@/components/CounterpartyTypeSwitch.vue';
import CounterpartySelect from '@/components/CounterpartySelect.vue';
import LegalEntityEdit from '@/components/contacts/LegalEntityEdit.vue';
import StorageEdit from '@/components/stock/StorageEdit.vue';
import { $requiredRule } from '@/lib/validations.js';
import type { StockOperation } from '@/models/StockOperations';

const props = defineProps<{
  model: StockOperation;
  disabled: boolean;
  counterpartyRole: string;
}>();

const showDrawer = ref(false);

const counterpartyLabel = computed(() => {
  const { counterpartyRole } = props;
  return {
    type: `fields.${counterpartyRole}Type`,
    choice: `fields.${counterpartyRole}`,
  };
});

const rules = $requiredRule(['date', 'storageId']);

const storages = computed(() => Storage.reactiveFilter());

const cpMap = new Map([
  ['Storage', StorageEdit],
  ['LegalEntity', LegalEntityEdit],
]);

const counterpartyEditComponent = computed(() => cpMap.get(props.model.counterpartyType));

function addCounterparty() {
  showDrawer.value = true;
}

function counterpartySaved(counterparty) {
  if (counterparty) {
    setTimeout(() => {
      props.model.counterpartyId = counterparty.id;
    }, 0);
  }
}

function counterpartyEditClosed() {
  showDrawer.value = false;
}

</script>
