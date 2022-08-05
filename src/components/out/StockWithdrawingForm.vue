<template lang="pug">

el-form.stock-withdrawing-form(
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

  el-form-item(:label="$t('fields.consigneeType')" prop="consigneeType")
    consignee-type-switch(v-model="model.consigneeType" @change="model.consigneeId = null")

  el-form-item(:label="$t('fields.consignee')" prop="consignee" v-if="model.consigneeType")
    prepend-select(@buttonClick="addConsignee")
      consignee-select(:type="model.consigneeType" v-model="model.consigneeId")

  el-form-item(:label="$t('fields.processing')" prop="processing")
    workflow-button(:workflow="workflow" v-model="model.processing" :disabled="disabled")

  component(
    :is="consigneeEditComponent"
    v-if="showDrawer"
    @saved="consigneeSaved"
    @closed="consigneeEditClosed"
    :drawer-style="{ top: '50px' }"
  )

</template>
<script>
/* eslint-disable vue/no-mutating-props */
import WorkflowButton from '@/lib/WorkflowButton.vue';
import Storage from '@/models/Storage';
import { workflow } from '@/models/StockWithdrawing';
import DateStringPicker from '@/lib/DateStringPicker.vue';
import ConsigneeTypeSwitch from '@/components/ConsigneeTypeSwitch.vue';
import ConsigneeSelect from '@/components/ConsigneeSelect.vue';
import ButtonPrepend from '@/lib/ButtonPrepend.vue';
import LegalEntityEdit from '@/components/contacts/LegalEntityEdit.vue';
import StorageEdit from '@/components/stock/StorageEdit.vue';

export default {
  name: 'StockWithdrawingForm',
  components: {
    LegalEntityEdit,
    ButtonPrepend,
    ConsigneeSelect,
    ConsigneeTypeSwitch,
    DateStringPicker,
    WorkflowButton,
    StorageEdit,
  },
  props: {
    model: Object,
    disabled: Boolean,
  },
  data() {
    return {
      showDrawer: false,
    };
  },
  computed: {
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
    consigneeEditComponent() {
      const { consigneeType } = this.model;
      return consigneeType ? `${consigneeType}Edit` : 'div';
    },
  },
  methods: {
    addConsignee() {
      this.showDrawer = true;
    },
    consigneeSaved(consignee) {
      if (consignee) {
        setTimeout(() => {
          this.model.consigneeId = consignee.id;
        }, 0);
      }
    },
    consigneeEditClosed() {
      this.showDrawer = false;
    },
  },
};

</script>
<style scoped lang="scss">
</style>
