<template lang="pug">

  el-form.article-property-form(
    :model="model"
    ref="form"
    size="mini"
    :rules="rules"
    :status-icon="true"
  )

    el-form-item(:label="$t('fields.name')" prop="name")
      el-input(v-model="model.name")

    el-form-item(:label="$t('fields.type')" prop="type")
      el-select(v-model="model.type")
        el-option(
          v-for="type in types" :key="type"
          :label="$t(`dataTypes.${type}`)" :value="type"
        )

    el-form-item(:label="$t('fields.required')")
      el-switch(v-model="model.isRequired")

</template>
<script>
import { VALUE_TYPES } from '@/models/ArticleProp';

export default {
  name: 'ArticlePropertyForm',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    types() {
      return Object.keys(VALUE_TYPES);
    },
    rules() {
      return {
        ...this.$requiredRule('name'),
        ...this.$requiredRule('type'),
      };
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

</style>
