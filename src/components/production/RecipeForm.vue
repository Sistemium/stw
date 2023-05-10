<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.recipe-form(
  ref="form"
  :model="model"
)
  el-form-item(
    prop="isSKU"
    :label="$t('fields.isSKU')"
  )
    el-switch(v-model="model.isSKU")

  materials-form(
    :materials="model.materials || null"
    ref="materialsFormRef"
    @create="onCreate"
  )

</template>
<script setup lang="ts">

import MaterialsForm from '@/components/production/MaterialsForm.vue';
import type { Article } from '@/models/Articles';
import { ref } from 'vue';
// import { useFormValidate } from '@/services/validating';

const props = defineProps<{
  model: Article,
}>();

const materialsFormRef = ref(null);

defineExpose({
  validate(callback) {
    materialsFormRef.value.validate(callback);
  },
});

function onCreate(materials) {
  // eslint-disable-next-line vue/no-mutating-props
  props.model.materials = materials;
}

</script>
