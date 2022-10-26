<template lang="pug">

el-form.prop-option-form(
  :model="model"
  ref="form"
  :rules="rules"
)
  el-form-item(:label="property.name" prop="name")
    el-input(v-model="model.name")

</template>
<script>

import ArticleProp from '@/models/ArticleProp';

export default {
  name: 'PropOptionForm',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    property() {
      return ArticleProp.reactiveGet(this.model.propId) || {};
    },
    rules() {
      return {
        ...this.$requiredRule('name'),
      };
    },
  },
};

</script>
<style scoped lang="scss">

</style>
