<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.stock-operation-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(:label="$t('fields.date')" prop="date")
    date-string-picker(v-model="model.date")

  el-form-item(:label="$t('fields.storage')" prop="storageId")
    el-select(v-model="model.storageId")
      el-option(
        v-for="{ id, name } in storages" :key="id"
        :label="name" :value="id"
      )

  el-form-item(:label="$t(counterpartyLabel.type)" prop="counterpartyType")
    counterparty-type-switch(v-model="model.counterpartyType" @change="model.counterpartyId = null")

  el-form-item(
    v-if="model.counterpartyType"
    :label="$t(counterpartyLabel.choice)"
    prop="counterparty"
  )
    button-prepend(@button-click="addCounterparty")
      counterparty-select(:type="model.counterpartyType" v-model="model.counterpartyId")

  el-form-item(:label="$t('fields.processing')" prop="processing")
    workflow-button(:workflow="workflow" v-model="model.processing")

  el-form-item(
    :label="$t('fields.commentText')"
    prop="commentText"
    v-if="!disabled || model.commentText"
  )
    el-input(v-model="model.commentText" type="textarea" :autosize="{ minRows: 2 }")

  component(
    :is="counterpartyEditComponent"
    v-if="showDrawer"
    @saved="counterpartySaved"
    @closed="counterpartyEditClosed"
    :drawer-style="{ top: '50px' }"
  )

</template>
<script>
/* eslint-disable vue/no-mutating-props */
import WorkflowButton from '@/lib/WorkflowButton.vue';
import Storage from '@/models/Storage';
import { workflow } from '@/models/StockWithdrawing';
import DateStringPicker from '@/lib/DateStringPicker.vue';
import ButtonPrepend from '@/lib/ButtonPrepend.vue';
import CounterpartyTypeSwitch from '@/components/CounterpartyTypeSwitch.vue';
import CounterpartySelect from '@/components/CounterpartySelect.vue';
import LegalEntityEdit from '@/components/contacts/LegalEntityEdit.vue';
import StorageEdit from '@/components/stock/StorageEdit.vue';

export default {
  name: 'StockOperationForm',
  components: {
    LegalEntityEdit,
    ButtonPrepend,
    CounterpartySelect,
    CounterpartyTypeSwitch,
    DateStringPicker,
    WorkflowButton,
    StorageEdit,
  },
  props: {
    model: Object,
    disabled: Boolean,
    counterpartyRole: String,
  },
  data() {
    return {
      showDrawer: false,
    };
  },
  computed: {
    counterpartyLabel() {
      const { counterpartyRole } = this;
      return {
        type: `fields.${counterpartyRole}Type`,
        choice: `fields.${counterpartyRole}`,
      };
    },
    rules() {
      return {
        ...this.$requiredRule(['date', 'storageId']),
      };
    },
    storages() {
      return Storage.reactiveFilter();
    },
    workflow() {
      return workflow;
    },
    counterpartyEditComponent() {
      const { counterpartyType } = this.model;
      return counterpartyType ? `${counterpartyType}Edit` : 'div';
    },
  },
  methods: {
    addCounterparty() {
      this.showDrawer = true;
    },
    counterpartySaved(counterparty) {
      if (counterparty) {
        setTimeout(() => {
          this.model.counterpartyId = counterparty.id;
        }, 0);
      }
    },
    counterpartyEditClosed() {
      this.showDrawer = false;
    },
  },
};

</script>
<style scoped lang="scss">
</style>
