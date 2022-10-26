<template lang="pug">

el-form.stock-taking-form(
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

  el-form-item(:label="$t('fields.processing')" prop="processing")
    workflow-button(:workflow="workflow" v-model="model.processing")

</template>
<script>

import Storage from '@/models/Storage';
import WorkflowButton from '@/lib/WorkflowButton.vue';
import { workflow } from '@/models/StockTaking';
import DateStringPicker from '@/lib/DateStringPicker.vue';

export default {
  name: 'StockTakingForm',
  components: { WorkflowButton, DateStringPicker },
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
