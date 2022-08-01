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

</template>
<script>

import WorkflowButton from '@/lib/WorkflowButton.vue';
import Storage from '@/models/Storage';
import { workflow } from '@/models/StockTaking';
import DateStringPicker from '@/lib/DateStringPicker.vue';
import ConsigneeTypeSwitch from '@/components/ConsigneeTypeSwitch.vue';
import ConsigneeSelect from '@/components/ConsigneeSelect.vue';
import PrependSelect from '@/lib/PrependSelect.vue';

export default {
  name: 'StockWithdrawingForm',
  components: {
    PrependSelect,
    ConsigneeSelect,
    ConsigneeTypeSwitch,
    DateStringPicker,
    WorkflowButton,
  },
  props: {
    model: Object,
    disabled: Boolean,
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
  },
  methods: {
    addConsignee() {
    },
  },
};

</script>
<style scoped lang="scss">
</style>
