<template lang="pug">

el-form.stock-withdrawing-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(:label="$t('fields.date')" prop="date")
    el-date-picker.date(v-model="model.date")

  el-form-item(:label="$t('fields.storage')" prop="storageId")
    el-select(v-model="model.storageId")
      el-option(
        v-for="{ id, name } in storages" :key="id"
        :label="name" :value="id"
      )

  el-form-item(:label="$t('fields.processing')" prop="processing")
    workflow-button(:workflow="workflow" v-model="model.processing" :disabled="disabled")

</template>
<script>

import WorkflowButton from '@/lib/WorkflowButton.vue';
import Storage from '@/models/Storage';
import { workflow } from '@/models/StockTaking';

export default {
  name: 'StockWithdrawingForm',
  components: { WorkflowButton },
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
};

</script>
<style scoped lang="scss">

</style>
