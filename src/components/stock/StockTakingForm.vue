<template lang="pug">
// eslint-disable vue/no-mutating-props
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
<script setup>

import { computed } from 'vue';
import Storage from '@/models/Storage';
import WorkflowButton from '@/lib/WorkflowButton.vue';
import { workflow } from '@/models/StockTaking';
import DateStringPicker from '@/lib/DateStringPicker.vue';
import { $requiredRule } from '@/lib/validations';
import { useFormValidate } from '@/services/validating';

defineProps({
  model: Object,
  disabled: Boolean,
});

const { form, validate } = useFormValidate();

defineExpose({ validate });

const rules = $requiredRule(['date', 'storageId']);

const storages = computed(() => Storage.reactiveFilter());

</script>
