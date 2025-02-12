<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.prop-option-form(
  ref="form"
  :model="model"
  :rules="rules"
)
  el-form-item(:label="property.name" prop="name")
    el-input(v-model="model.name")

</template>
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed } from 'vue';
import ArticleProp from '@/models/ArticleProp';
import { $requiredRule } from '@/lib/validations';
import { useFormValidate } from '@/services/validating';

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

const { form, validate } = useFormValidate();

defineExpose({ validate });

const property = computed(() => {
  const { propId } = props.model;
  return ArticleProp.reactiveGet(propId);
});

const rules = computed(() => $requiredRule('name'));

</script>
