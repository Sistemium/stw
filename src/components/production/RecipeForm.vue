<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.recipe-form(
  :model="model"
  ref="form"
  :rules="rules"
)
  el-form-item(:label="$t('fields.isSKU')" prop="isSKU")
    el-switch(v-model="model.isSKU")

  materials-form(:materials="model.materials || null" @create="onCreate")

</template>
<script>

import MaterialsForm from '@/components/production/MaterialsForm.vue';
import Vue from 'vue';

export default {
  name: 'RecipeForm',
  components: { MaterialsForm },
  props: {
    model: Object,
  },
  methods: {
    onCreate(materials) {
      Vue.set(this.model, 'materials', materials);
    },
  },
  computed: {
    rules() {
      // return this.$requiredRule('name');
      return {};
    },
  },
};

</script>
<style scoped lang="scss">

</style>
