<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.storage-form(
  ref="form"
  :model="model"
  :rules="rules"
)

  el-form-item(
    :label="$t('fields.type')"
    prop="type"
  )
    el-radio-group(v-model="model.type")
      el-radio-button(label="facility") {{ $t('concepts.facility') }}
      el-radio-button(label="personal") {{ $t('concepts.personal') }}

  el-form-item(
    :label="$t('fields.name')"
    prop="name"
  )
    el-input(v-model="model.name")

</template>
<script setup>

import { computed, ref } from 'vue';
import { $requiredRule } from '@/lib/validations';

defineProps({
  model: Object,
});

const form = ref(null);
const rules = computed(() => $requiredRule('name'));

</script>
