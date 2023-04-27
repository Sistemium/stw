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
    @create="onCreate"
  )

</template>
<script setup lang="ts">

import { ref } from 'vue';
import MaterialsForm from '@/components/production/MaterialsForm.vue';
import type { Article } from '@/models/Articles';

const props = defineProps<{
  model: Article,
}>();

const form = ref(null);

function onCreate(materials) {
  // eslint-disable-next-line vue/no-mutating-props
  props.model.materials = materials;
}

</script>
<style scoped lang="scss">

</style>
