<template lang="pug">

  el-form.article-property-form(
    :model="model"
    ref="form"
    :rules="rules"
    :status-icon="false"
  )

    el-form-item(:label="$t('fields.name')" prop="name")
      el-input(v-model="model.name")

    el-form-item.type(:label="$t('fields.valueType')" prop="type")
      el-select(v-model="model.type")
        el-option(
          v-for="type in types" :key="type"
          :label="$t(`dataTypes.${type}`)" :value="type"
        )

    el-form-item(:label="$t('fields.prefix')" prop="prefix")
      el-input(v-model="model.prefix")

    el-form-item(:label="$t('fields.suffix')" prop="suffix")
      el-input(v-model="model.suffix")

    el-form-item(
      :label="$t('fields.inverse')" prop="inverse"
      v-if="model.type === 'boolean'"
    )
      el-input(v-model="model.inverse")

    el-form-item(:label="$t('fields.required')" prop="isRequired")
      el-switch(v-model="model.isRequired")

    el-form-item(:label="$t('fields.naming')" prop="isNaming")
      el-switch(v-model="model.isNaming")

    el-form-item(:label="$t('fields.ord')" prop="ord")
      el-input-number(v-model="model.ord")

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

.type ::v-deep .el-select {
  float: right;
}

</style>
